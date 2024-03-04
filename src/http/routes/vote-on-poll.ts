import { z } from 'zod'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'

import { redis } from '../../lib/redis'
import { prisma } from '../../lib/prisma'

export const voteOnPoll = async (app: FastifyInstance) => {
  app.post('/polls/:pollId/votes', async (req, reply) => {
    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    })

    const { pollId } = voteOnPollParams.parse(req.params)
    const { pollOptionId } = voteOnPollBody.parse(req.body)

    let { sessionId } = req.cookies

    if (sessionId) {
      const userAlreadyVoted = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      })

      if (userAlreadyVoted && userAlreadyVoted.pollOptionId !== pollOptionId) {
        await prisma.vote.delete({
          where: {
            id: userAlreadyVoted.id,
          },
        })

        await redis.zincrby(pollId, -1, userAlreadyVoted.pollOptionId)
      } else if (userAlreadyVoted) {
        return reply.status(400).send({ message: 'user-already-voted' })
      }
    }

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true,
      })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    })

    await redis.zincrby(pollId, 1, pollOptionId)

    return reply.status(201).send()
  })
}
