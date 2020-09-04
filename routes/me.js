export default async (app, opts) => {
	app.get('/me', {
		preValidation: [app.authenticate]
	}, async (req, res) => {
		const {rows} = await app.pg.query('select * from "user" where id = $1', [req.user.sub])
		return rows[0]
	})

	app.get('/unseen_count', {
		preValidation: [app.authenticate]
	}, async (req, res) => {
		const {userId} = req.user.sub
		const {rows} = await app.pg.query(`select count(*)::integer
                                       from notification
                                       where "receiverId" = $1
                                         and not "isRead"`, [userId])
		return rows[0].count
	})
}
