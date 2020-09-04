import app from './app.js'
import { parse } from 'url'
import { notification_ws } from './ws.server.js'

const PORT = 9001 || process.env.PORT

app.listen(PORT, '::1', err => {
	if (err) throw err
	console.log(`http://localhost:${PORT}`)
})

app.server.on('upgrade', async (req, socket, head) => {
	const {pathname} = parse(req.url)

	if (pathname === '/notification') {
		console.log('Emittd!')
		notification_ws.handleUpgrade(req, socket, head, ws => {
			notification_ws.emit('connection', ws, req)
		})
	} else {
		// socket.destroy();
	}
})
