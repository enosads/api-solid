import type { Gym } from '../../generated/prisma/client'
import type { GymCreateInput } from '../../generated/prisma/models'

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  create(data: GymCreateInput): Promise<Gym>
}
