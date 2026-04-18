import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { CheckIn } from '../../generated/prisma/client'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUserCase {
  constructor(private checkInsRepository: CheckInsRepository) {}
  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    if (checkOnSameDate) {
      throw new Error('Check-in already exists for this user on the same date.')
    }
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
