import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndauthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const { token } = await createAndauthenticateUser(app)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })
})
