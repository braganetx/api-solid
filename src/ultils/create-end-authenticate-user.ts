import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { FastifyInstance } from "fastify"
import request from "supertest"

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {

    await prisma.user.create({
        data: {
            name: 'Jhon Doe',
            email: 'jhondoe@exemple.com',
            password_hash: await hash('123456', 6),
            role: isAdmin ? 'ADMIN' : 'MEMBER'
        }
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