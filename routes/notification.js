export default async (app, opts) => {
	app.get('/notifications', {
		preValidation: [app.authenticate]
	}, async (req, reply) => {
		const userId = req.user.sub
		const sql = `SELECT n.*, (SELECT row_to_json(u) FROM "user" u WHERE u.id = n."senderId") AS "user"
								 FROM notification n
								 WHERE n."receiverId" = $1
		`
		const values = [userId]
		const {rows} = await app.pg.query(sql, values)
		return rows
	})
}
