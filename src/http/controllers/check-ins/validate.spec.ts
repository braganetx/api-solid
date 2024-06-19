import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/ultils/create-end-authenticate-user";
import { prisma } from "@/lib/prisma";

describe('Validate Check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    it('should be able to validate a Check-in', async () => {

        const { token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                latitude: -16.68030230,
                longitude: -49.24578670
            }
        })

        let checkIn = await prisma.checkin.create({
            data: {
                gymId: gym.id,
                user_id: user.id,
            }
        })

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(204)

        checkIn = await prisma.checkin.findUniqueOrThrow({
            where: {
                id: checkIn.id
            }
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))

    })
})

