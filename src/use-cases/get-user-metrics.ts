import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { Checkin } from '@prisma/client'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) { }

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserID(userId)
    
    return {
        checkInsCount,
    }
  }
}