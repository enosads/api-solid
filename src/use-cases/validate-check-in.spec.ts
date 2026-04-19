import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ValidateCheckInUserCase } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepository

let sut: ValidateCheckInUserCase

describe('Validate Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUserCase(checkInsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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

  it('should not be able to validate check-in after 20 minutes', async () => {
    vi.setSystemTime(new Date(2026, 3, 19, 0, 53))
    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 21 * 60 * 1000

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: checkIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
