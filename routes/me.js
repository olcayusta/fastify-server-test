export default async (app, opts) => {
	app.get('/me', {
		preValidation: [app.authenticate]
	}, async (req, reply) => {
		const {rows} = await app.pg.query('SELECT * FROM "user" WHERE id = $1', [req.user.sub])
		return rows[0]
	})

	app.get('/unseen_count', {
		preValidation: [app.authenticate]
	}, async (req, reply) => {
		const {rows} = await app.pg.query(`SELECT count(*)::INTEGER
																			 FROM notification
																			 WHERE "receiverId" = $1
																				 AND NOT "isRead"`, [req.user.sub])
		return rows[0].count
	})
}
