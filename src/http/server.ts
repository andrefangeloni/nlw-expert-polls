import fastify from 'fastify'

import { createPoll } from './routes/create-poll'

const app = fastify()

const port = 3333

app.register(createPoll)

app.listen({ port }).then(() => {
  console.log(`Server running on port ${port} 🚀`)
})
