import fp from 'fastify-plugin'

export default fp(async (app, opts) => {
	app.get('/hello', async (req, res) => {
		return 'hello world'
	})
})
