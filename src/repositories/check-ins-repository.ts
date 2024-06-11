import { Checkin, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>
  findByUserIdDate(userId: string, date: Date): Promise<Checkin | null>

}