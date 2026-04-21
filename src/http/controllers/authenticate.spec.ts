import { expect, it, describe, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import { authenticateUser } from '@/http/test-utils'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const { token } = await authenticateUser(app)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })
})
