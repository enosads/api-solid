import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export interface AuthenticateUserParams {
  name?: string
  email?: string
  password?: string
}

export async function authenticateUser(
  app: FastifyInstance,
  params: AuthenticateUserParams = {},
) {
  const {
    name = 'John Doe',
    email = 'johndoe@example.com',
    password = '123456',
  } = params

  await request(app.server).post('/users').send({
    name,
    email,
    password,
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password,
  })

  return {
    token: authResponse.body.token,
    userId: authResponse.body.userId,
  }
}
