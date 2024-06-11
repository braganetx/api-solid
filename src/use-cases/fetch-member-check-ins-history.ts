import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { Checkin } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/ultils/get-distance-betweeen-coordinate'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLogitude: number
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
    userLatitude,
    userLogitude
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

    const gym = await this.gymsRepository.findById(gymId)

    if(!gym){
      throw new ResourceNotFoundError()
      
    }

    // calculate distance betweem user and gym

    const distance = getDistanceBetweenCoordinates(
      {latitude: userLatitude, longitude: userLogitude},
      {
        latitude: gym.latitude.toNumber(), 
        longitude: gym.longitude.toNumber()
      }
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if(distance > MAX_DISTANCE_IN_KILOMETERS){
      throw new MaxDistanceError()
      
    }


    const checkInOnSameDay = await this.checkInsRepository.findByUserIdDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()

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