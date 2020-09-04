import fastify from 'fastify'
import fastifyEnv from 'fastify-env'
import fastifyAutoload from 'fastify-autoload'
import fastifyPostgres from 'fastify-postgres'
import fastifyJWT from 'fastify-jwt'
import fastifyCors from 'fastify-cors'
import fastifyStatic from 'fastify-static'
import fastifyCompress from 'fastify-compress'
import { join } from 'desm'
import path from 'path'
import deneme from './deneme.js'
import { notification_ws } from './ws.server.js'

const options = {
	schema: {
		type: 'object',
		required: ['PORT'],
		properties: {
			PORT: {
				type: 'string',
				default: 3000
			}
		}
	},
	dotenv: true
}

const app = fastify()

app.register(fastifyJWT, {
	secret: 'supersecret',
	sign: {
		expiresIn: '24h'
	}
})

app.decorate("notification", async (request, reply) => {
	console.log('Ok!')
	const data = {
		celebName: 'Lisa Joyce',
		picture: 'https://www.theatricalindex.com/media/cimage/persons/lisa-joyce/headshot_headshot.jpg'
	}

	notification_ws.clients.forEach(value => {
		value.send(JSON.stringify(data))
	})

})

app.decorate("authenticate", async (request, reply) => {
	try {
		const x = await request.jwtVerify()
	} catch (err) {
		reply.send(err)
	}
})

app.register(deneme)

app.register(fastifyCompress)

app.register(fastifyCors)

app.register(fastifyEnv, options)

app.register(fastifyAutoload, {
	dir: join(import.meta.url, 'routes')
})

app.register(fastifyPostgres, {
	connectionString: 'postgres://postgres:123456@localhost/qa_beta'
})

app.register(fastifyStatic, {
	root: path.join(path.resolve(), 'public'),
	prefix: '/public/'
})

export default app
