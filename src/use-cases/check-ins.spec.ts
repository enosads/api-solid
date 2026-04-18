import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import type { Gym } from '../../generated/prisma/client'
import { CheckInUserCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let gym: Gym

let sut: CheckInUserCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUserCase(checkInsRepository, gymsRepository)
    vi.useFakeTimers()

    gym = await gymsRepository.create({
      title: 'gym-01',
      description: null,
      phone: null,
      latitude: -7.0312957,
      longitude: -37.3164699,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: -7.0312957,
      userLongitude: -37.3164699,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: -7.0312957,
      userLongitude: -37.3164699,
    })

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: 'user-01',
        userLatitude: -7.0312957,
        userLongitude: -37.3164699,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const gym = await gymsRepository.create({
      title: 'gym-01',
      description: null,
      phone: null,
      latitude: -7.0312957,
      longitude: -37.3164699,
    })

    await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: -7.0312957,
      userLongitude: -37.3164699,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: -7.0312957,
      userLongitude: -37.3164699,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    const gym2 = await gymsRepository.create({
      title: 'gym-02',
      description: null,
      phone: null,
      latitude: -7.029941,
      longitude: -37.285262,
    })

    await expect(() =>
      sut.execute({
        gymId: gym2.id,
        userId: 'user-01',
        userLatitude: -7.0312957,
        userLongitude: -37.3164699,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
