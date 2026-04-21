import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase()
    const { user } = await getUserProfileUseCase.execute({
      userId: request.user.sub,
    })

    return reply.send({ user: { ...user, password_hash: undefined } })
  } catch (err) {
    console.log(err)
    throw err
  }
}
