import ws from 'ws'
import fp from 'fastify-plugin'

export const notification_ws = new ws.Server({noServer: true});

notification_ws.on('connection', (ws, req, client) => {
	ws.on('message', data => {
		console.log('Msg geldi', data)
		// console.log(`Received message ${data} from user ${client.userId}`)
	})
});
