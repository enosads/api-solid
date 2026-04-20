import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { omitSensitiveFields } from '@/http/utils/omit-sensitive-fields'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()

  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase()
    const { user } = await getUserProfileUseCase.execute({
      userId: request.user.sub,
    })

    return reply.send({ user: omitSensitiveFields(user) })
  } catch (err) {
    console.log(err)
    throw err
  }
}
