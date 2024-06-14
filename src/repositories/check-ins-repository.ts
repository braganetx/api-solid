import { Checkin, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  findById(id: string): Promise<Checkin | null>
  findByUserIdDate(userId: string, date: Date): Promise<Checkin | null>
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>
  countByUserID(userId: string): Promise<number>
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>
  save(checkIn: Checkin): Promise<Checkin>
}