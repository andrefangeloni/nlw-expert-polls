import { z } from 'zod'
import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const app = fastify()

const prisma = new PrismaClient()

const port = 3333

app.post('/polls', async (req, reply) => {
  const createPollBody = z.object({
    title: z.string(),
  })

  const { title } = createPollBody.parse(req.body)

  const poll = await prisma.poll.create({
    data: {
      title,
    },
  })

  return reply.status(201).send({ pollId: poll.id })
})

app.listen({ port }).then(() => {
  console.log(`Server running on port ${port} 🚀`)
})
