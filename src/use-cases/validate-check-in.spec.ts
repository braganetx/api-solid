import { InMemoryChekinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'

let checkInsRepository: InMemoryChekinsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryChekinsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })


    it('should be able to validate the check-in', async () => {

        const createdCheckIn = await checkInsRepository.create({
            gymId: 'gym-01',
            user_id: 'user-01',
        })

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.itens[0].validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistent check-in', async () => {

        await expect(() => sut.execute({
            checkInId: 'inexistent-check-in-id',
        }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

        const createdCheckIn = await checkInsRepository.create({
            gymId: 'gym-01',
            user_id: 'user-01',
        })

        const twentyOneMinutesInMS = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMS)

        expect(() => sut.execute({
            checkInId: createdCheckIn.id,
        }),
        ).rejects.toBeInstanceOf(Error)

    })
})
