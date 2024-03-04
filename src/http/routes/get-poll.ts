import { z } from 'zod'
import { FastifyInstance } from 'fastify'

import { prisma } from '../../lib/prisma'

export const getPoll = async (app: FastifyInstance) => {
  app.get('/polls/:pollId', async (req) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const { pollId } = getPollParams.parse(req.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return { poll }
  })
}
