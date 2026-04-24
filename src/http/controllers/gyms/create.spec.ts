import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndauthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndauthenticateUser(app)
    const timestamp = Date.now()

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `JavaScript Gym ${timestamp}`,
        latitude: -27.2092052,
        longitude: -49.6401091,
        phone: '83991955852',
        description: 'Some description',
      })

    expect(response.status).toBe(201)
  })
})
