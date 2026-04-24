import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndauthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch nearby gyms', async () => {
    const { token } = await createAndauthenticateUser(app)

    const createNearResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Near Gym`,
        description: 'Some description',
        phone: '83991955852',
        latitude: -7.036881,
        longitude: -37.313905,
      })

    expect(createNearResponse.status).toBe(201)

    const createFarResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Far Gym`,
        description: 'Some description',
        phone: '83991955852',
        latitude: -7.159996,
        longitude: -37.307446,
      })

    expect(createFarResponse.status).toBe(201)

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -7.036881,
        longitude: -37.313905,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
