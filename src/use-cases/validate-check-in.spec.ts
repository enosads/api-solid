import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ValidateCheckInUserCase } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepository

let sut: ValidateCheckInUserCase

describe('Validate Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUserCase(checkInsRepository)
    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  it('should be able to validate check in', async () => {
    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn: validatedCheckIn } = await sut.execute({
      checkInId: checkIn.id,
    })

    expect(validatedCheckIn.validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate unexistent check-in', async () => {
    expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
