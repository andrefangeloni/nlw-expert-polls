import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyWebsocket from '@fastify/websocket'

import { getPoll } from './routes/get-poll'
import { createPoll } from './routes/create-poll'
import { voteOnPoll } from './routes/vote-on-poll'

import { pollResults } from './ws/poll-results'

const app = fastify()

const port = 3333

app.register(fastifyCookie, {
  secret: 'polls-app-nlw',
  hook: 'onRequest',
})

app.register(fastifyWebsocket)

app.register(getPoll)
app.register(createPoll)
app.register(voteOnPoll)
app.register(pollResults)

app.listen({ port }).then(() => {
  console.log(`Server running on port ${port} 🚀`)
})
