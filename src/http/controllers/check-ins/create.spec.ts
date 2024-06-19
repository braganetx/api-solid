import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/ultils/create-end-authenticate-user";
import { prisma } from "@/lib/prisma";

describe('Create Check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a Check-in', async () => {

        const { token } = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                latitude: -16.68030230,
                longitude: -49.24578670
            }
        })

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -16.68030230,
                longitude: -49.24578670
            })

        expect(response.statusCode).toEqual(201)

    })
})

