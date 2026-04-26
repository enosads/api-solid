import type { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(role: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { user } = request
    if (user.role !== role) {
      reply.status(403).send({ message: 'Forbidden' })
    }
  }
}
