import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndauthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token } = await createAndauthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.status).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'John Doe',
        email: 'johndoe@example.com',
        created_at: expect.any(String),
      }),
    )
  })
})
