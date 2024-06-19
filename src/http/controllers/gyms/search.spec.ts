import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/ultils/create-end-authenticate-user";

describe('Profile', () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a gym', async () => {

        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some description.',
                phone: '62999999999',
                latitude: -16.68030230,
                longitude: -49.24578670
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TypeScript Gym',
                description: 'Some description.',
                phone: '62999999999',
                latitude: -16.68030230,
                longitude: -49.24578670
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                q: 'JavaScript',
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym'
            })
        ])

    })
})

