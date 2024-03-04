import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'

import { getPoll } from './routes/get-poll'
import { createPoll } from './routes/create-poll'
import { voteOnPoll } from './routes/vote-on-poll'

const app = fastify()

const port = 3333

app.register(fastifyCookie, {
  secret: 'polls-app-nlw',
  hook: 'onRequest',
})

app.register(getPoll)
app.register(createPoll)
app.register(voteOnPoll)

app.listen({ port }).then(() => {
  console.log(`Server running on port ${port} 🚀`)
})
