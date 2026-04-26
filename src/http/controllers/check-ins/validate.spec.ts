import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Validade Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        latitude: -27.2092052,
        longitude: -49.6401091,
        title: 'JavaScript Gym',
        phone: '11999999999',
        description: 'Some description',
      },
    })

    const checkin = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkin.id}/validate`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)

    const checkinUpdated = await prisma.checkIn.findFirstOrThrow({
      where: {
        id: checkin.id,
      },
    })

    expect(checkinUpdated.validated_at).toBeTruthy()
  })
})
