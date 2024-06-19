import { FastifyInstance } from "fastify"
import request from "supertest"

export async function createAndAuthenticateUser(app: FastifyInstance) {
    await request(app.server).post('/users').send({
        name: 'Jhon Doe',
        email: 'jhondoe@exemple.com',
        password: '123456'
    })

    const oauthResponse = await request(app.server).post('/sessions').send({
        email: 'jhondoe@exemple.com',
        password: '123456'
    })

    const { token } = oauthResponse.body

    return {
        token,
    }
}