import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/virify-jwt'
import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'
import { verifyuserRole } from '@/http/middlewares/virify-user-role'


export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.get('/gyms/search', search)
    app.get('/gyms/nearby', nearby)

    app.post('/gyms', { onRequest: [verifyuserRole('ADMIN')] }, create)
}
