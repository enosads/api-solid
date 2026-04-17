import type { CheckIn } from '../../generated/prisma/client'
import type { CheckInUncheckedCreateInput } from '../../generated/prisma/models'

export interface CheckInsRepository {
  create(data: CheckInUncheckedCreateInput): Promise<CheckIn>
}
