import { Prisma, Checkin } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryChekinsRepository implements CheckInsRepository {

  public itens: Checkin[] = []

  async findByUserIdDate(userId: string, date: Date) {

    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.itens.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number){
    return this.itens
    .filter((item) => item.user_id === userId)
    .slice((page -1) * 20, page * 20)
  }

  async countByUserID(userId: string){
    return this.itens
    .filter((item) => item.user_id === userId).length
  }

  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gymId: data.gymId,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.itens.push(checkIn)

    return checkIn
  }
}
