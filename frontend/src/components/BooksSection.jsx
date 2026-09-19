import SectionHeading from './SectionHeading'
import BookCard from './BookCard'
import { Reveal, StaggerGroup } from './motion'
import { books } from '../data/content'

export default function BooksSection({ title = 'Books by Umu Abdullah Riyadh', eyebrow = 'Written works' }) {
  if (!books.length) return null

  return (
    <section className="section section--tinted" id="books">
      <div className="container">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          lede="Books written by Umu Abdullah Riyadh to help readers learn and grow in beneficial knowledge."
        />
        <StaggerGroup className="grid grid--4">
          {books.map((b) => (
            <Reveal key={b.title}>
              <BookCard {...b} />
            </Reveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}