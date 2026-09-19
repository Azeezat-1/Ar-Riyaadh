import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

const data = (res) => res.data.data
const body = (res) => res.data

export const getClasses = (params) => client.get('/classes', { params }).then(data)
export const getLectures = (params) => client.get('/lectures', { params }).then(data)
export const getTestimonials = () => client.get('/testimonials').then(data)
export const getArticles = () => client.get('/homeschooling').then(data)
export const getArticleBySlug = (slug) => client.get(`/homeschooling/slug/${slug}`).then(data)

export const submitContactMessage = (payload) => client.post('/contact', payload).then(body)
export const submitTestimonial = (payload) => client.post('/testimonials', payload).then(body)

export default client