import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryChekinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUseCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryChekinsRepository
let sut: FetchUseCheckInsHistoryUseCase

describe('Fetch User Check-in History Use Case',  () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryChekinsRepository()
    sut = new FetchUseCheckInsHistoryUseCase(checkInsRepository)
  })


  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
        gymId: 'gym-01',
        user_id: 'user-01'
    })

    await checkInsRepository.create({
        gymId: 'gym-02',
        user_id: 'user-01'
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
        expect.objectContaining({gymId: 'gym-01'}),
        expect.objectContaining({gymId: 'gym-02'})
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
   
    for(let i = 1; i <= 22; i++){
        await checkInsRepository.create({
            gymId: `gym-${i}`,
            user_id: 'user-01'
        })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
        expect.objectContaining({gymId: 'gym-21'}),
        expect.objectContaining({gymId: 'gym-22'})
    ])
  })
})
