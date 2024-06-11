import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryChekinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryChekinsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case',  () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryChekinsRepository()
    gymsRepository = new InMemoryGymsRepository
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -16.68030230,
      longitude: -49.24578670
    })

    // await sut.execute({
    //   title: 'JavaScript Gym',
    //   description: null,
    //   phone: null,
    //   latitude: -16.68030230,
    //   longitude: -49.24578670
    // })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.68030230,
      userLogitude: -49.24578670
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twise in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.68030230,
      userLogitude: -49.24578670
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -16.68030230,
        userLogitude: -49.24578670
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twise but in diferent days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.68030230,
      userLogitude: -49.24578670
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -16.68030230,
        userLogitude: -49.24578670
      })

      expect(checkIn.id).toEqual(expect.any(String))
  })


  it('should not be able to check in on distant gym', async () => {

    gymsRepository.itens.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-16.6814501),
      longitude: new Decimal(-49.2450244)
    })

    await expect(() => 
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -16.68030230,
        userLogitude: -49.24578670
    }),
  ).rejects.toBeInstanceOf(MaxDistanceError)
  })

})
