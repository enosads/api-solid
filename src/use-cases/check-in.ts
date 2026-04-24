import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { GymsRepository } from '@/repositories/gyms-repository'
import type { CheckIn } from '../../generated/prisma/client'
import { getDistanceBetweenCoordinates } from '../utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUserCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}
  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
    )

    const MAX_DISTANCE_IN_KM = 0.1
    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError()
    }

    const checkOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    if (checkOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
