import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'


export async function nearby(request: FastifyRequest, replay: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
        latitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        })
    })

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

    const fetchNearbyGymsQueryseCase = makeFetchNearbyGymsUseCase()

    const { gyms } = await fetchNearbyGymsQueryseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude
    })

    return replay.status(200).send({
        gyms
    })
}
