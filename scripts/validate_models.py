#!/usr/bin/env python3
"""Validates the Ar-Riyaadh Academy data model and the API documentation.

The Mongoose schemas are the source of truth for the data model, so this
script inspects the real schemas rather than parsing JavaScript by hand. It
shells out to two small Node helpers that dump the running models and routes
as JSON:

    scripts/dump-models.mjs   -> every schema, field and index
    scripts/dump-routes.mjs   -> every registered route

Checks performed:

  * every collection records createdAt/updatedAt
  * every money field is an integer amount named <something>Kobo
  * every `ref` points at a collection that exists
  * every unique field is backed by a unique index
  * every collection carries at least one index
  * every endpoint in docs/api-contract.md exists in the code
  * every endpoint the frontend calls exists in the code

Usage:

    python3 scripts/validate_models.py [--json]
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NODE = "node"

ERRORS: list[str] = []
WARNINGS: list[str] = []


def error(message: str) -> None:
    ERRORS.append(message)


def warn(message: str) -> None:
    WARNINGS.append(message)


def run_dump(script: str) -> dict:
    result = subprocess.run(
        [NODE, str(ROOT / "scripts" / script)],
        capture_output=True,
        text=True,
        cwd=ROOT,
    )
    if result.returncode != 0:
        print(f"could not run {script}:\n{result.stderr.strip()}", file=sys.stderr)
        raise SystemExit(2)
    return json.loads(result.stdout)


# ---------------------------------------------------------------- the model --

def validate_models(models: list[dict]) -> dict:
    by_collection = {m["collection"]: m for m in models}

    for model in models:
        collection = model["collection"]
        field_names = {f["name"] for f in model["fields"]}
        indexed_keys = {key for index in model["indexes"] for key in index["keys"]}

        # 1. Timestamps.
        if not model["timestamps"]:
            error(f"{collection}: no timestamps; createdAt/updatedAt are missing")

        # 2. Money fields.
        for field in model["fields"]:
            name = field["name"]
            if name.endswith("Kobo"):
                if field["type"] != "Number":
                    error(f"{collection}.{name}: a money field must be a Number, not {field['type']}")
                if field.get("enum"):
                    error(f"{collection}.{name}: a money field must not have an enum")
            elif name in {"price", "amount", "total", "discount", "tax", "refunded", "balance"}:
                error(
                    f"{collection}.{name}: a money field must end in 'Kobo' so its unit is explicit"
                )
            elif field["type"] == "Number" and name.lower() in {"price", "amount", "cost"}:
                warn(f"{collection}.{name}: a numeric money field should end in 'Kobo'")

        # 3. References must point at a real collection.
        for field in model["fields"]:
            ref = field.get("ref")
            if ref and ref not in by_collection:
                error(f"{collection}.{field['name']}: references unknown model '{ref}'")

        # 4. A unique field needs a unique index behind it.
        for field in model["fields"]:
            if not field.get("unique"):
                continue
            name = field["name"]
            if name not in indexed_keys:
                error(f"{collection}.{name}: marked unique in the schema but has no index")
                continue
            backing = next(
                (i for i in model["indexes"] if i["keys"] == [name] or (len(i["keys"]) == 1 and i["keys"][0] == name)),
                None,
            )
            if backing is None:
                error(f"{collection}.{name}: marked unique in the schema but has no index")
            elif not backing["unique"]:
                error(f"{collection}.{name}: the index on it is not unique")

        # 5. Every collection needs at least one index.
        if not model["indexes"]:
            warn(f"{collection}: no indexes at all")

        # 6. Every collection needs a stable identifier.
        if "id" not in field_names and "_id" not in field_names:
            warn(f"{collection}: no explicit id field (Mongoose adds _id automatically)")

    return {
        "collections": len(models),
        "fields": sum(len(m["fields"]) for m in models),
        "indexes": sum(len(m["indexes"]) for m in models),
    }


# --------------------------------------------------------------- the routes --

def normalise(path: str) -> str:
    """Turns a documented path into a comparable form."""
    path = path.strip()
    if not path.startswith("/"):
        path = "/" + path
    if not path.startswith("/api") and path != "/":
        path = "/api" + path
    path = re.sub(r"/+$", "", path)
    return path or "/"


def pattern_of(path: str) -> str:
    """Replaces every path parameter with a wildcard so paths compare."""
    return re.sub(r"/(:[A-Za-z_][A-Za-z0-9_]*|\*)", "/:*", path)


def validate_contract(routes: list[dict]) -> dict:
    registered = {(r["method"], r["path"]) for r in routes}
    patterns = {(r["method"], pattern_of(r["path"])) for r in routes}

    contract_path = ROOT / "docs" / "api-contract.md"
    documented: set[tuple[str, str]] = set()
    if contract_path.exists():
        text = contract_path.read_text(encoding="utf-8")
        for method, path in re.findall(r"\|\s*(GET|POST|PUT|PATCH|DELETE)\s*\|\s*`([^`]+)`\s*\|", text):
            documented.add((method, normalise(path)))
    else:
        error("docs/api-contract.md is missing")

    for method, path in sorted(documented):
        if (method, path) in registered:
            continue
        if (method, pattern_of(path)) in patterns:
            continue
        error(f"documented but not in the code: {method} {path}")

    # Every route should be mentioned in the contract, even if it appears in
    # a paragraph rather than a table.
    contract_text = contract_path.read_text(encoding="utf-8") if contract_path.exists() else ""
    for method, path in sorted(registered):
        if path == "/" or not path.startswith("/api"):
            continue
        if path in contract_text:
            continue
        warn(f"{method} {path} is not mentioned in docs/api-contract.md")

    # The frontend's calls.
    client_path = ROOT / "frontend" / "src" / "api" / "client.js"
    frontend_calls = 0
    if client_path.exists():
        text = client_path.read_text(encoding="utf-8")
        for method, path in re.findall(r"client\.(get|post|put|patch|delete)\(\s*[`']([^`']+)[`']", text):
            frontend_calls += 1
            clean = re.sub(r"\$\{[^}]+\}", "*", path)
            # The frontend's axios baseURL already ends in /api.
            wanted = (method.upper(), pattern_of("/api/" + clean.lstrip("/")))
            if wanted not in patterns:
                error(f"the frontend calls {method.upper()} {path} but no route matches it")
    else:
        warn("frontend/src/api/client.js was not found")

    return {"routes": len(routes), "documented": len(documented), "frontend_calls": frontend_calls}


# ------------------------------------------------------------------- output --

def main() -> int:
    as_json = "--json" in sys.argv

    models = run_dump("dump-models.mjs")["models"]
    routes = run_dump("dump-routes.mjs")["routes"]

    model_summary = validate_models(models)
    route_summary = validate_contract(routes)

    if as_json:
        print(json.dumps({
            "models": model_summary,
            "routes": route_summary,
            "errors": ERRORS,
            "warnings": WARNINGS,
        }, indent=2))
        return 1 if ERRORS else 0

    print("Ar-Riyaadh Academy — model and contract validation\n")
    print(f"  collections   {model_summary['collections']}")
    print(f"  fields        {model_summary['fields']}")
    print(f"  indexes       {model_summary['indexes']}")
    print(f"  routes        {route_summary['routes']}")
    print(f"  documented    {route_summary['documented']} endpoints")
    print(f"  frontend uses {route_summary['frontend_calls']} endpoints")

    print("\nCollections")
    for model in sorted(models, key=lambda m: m["collection"]):
        unique = sum(1 for i in model["indexes"] if i["unique"])
        print(f"  {model['collection']:<22} {len(model['fields']):>3} fields  "
              f"{len(model['indexes']):>2} indexes ({unique} unique)")

    if WARNINGS:
        print(f"\nWarnings ({len(WARNINGS)})")
        for message in WARNINGS:
            print(f"  ! {message}")

    if ERRORS:
        print(f"\nErrors ({len(ERRORS)})")
        for message in ERRORS:
            print(f"  x {message}")
        print("\nFAILED")
        return 1

    print("\nOK — the data model and the documentation agree with the code.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
