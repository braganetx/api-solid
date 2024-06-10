import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { Checkin } from '@prisma/client'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: Checkin
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) { }

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDay = await this.checkInsRepository.findByUserIdDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error()

    }

    const checkIn = await this.checkInsRepository.create({
      gymId: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}