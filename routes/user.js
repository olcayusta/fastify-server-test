export default async (app, opts) => {
	app.get('/users', async (req, reply) => {
		const {rows} = await app.pg.query('select id, "displayName", picture, "signupDate" from "user"')
		return rows
	})

	app.get('/users/:id', async (req, res) => {
		const {rows} = await app.pg.query(`select id, "displayName", picture, "signupDate"
                                       from "user"
                                       where id = $1`, [req.params.id])
		return rows[0]
	})

	app.get('/users/:id/questions', async (req, res) => {
		const {rows} = await app.pg.query(`select *
                                       from question
                                       where "userId" = $1`, [req.params.id])
		return rows
	})

	app.get('/users/:id/answers', async (req, res) => {
		const {rows} = await app.pg.query(`select *
                                       from question_answer
                                       where "userId" = $1`, [req.params.id])
		return rows
	})

	app.post('/', async (req, res) => {
		const {email, password, displayName, picture} = req.body
		const values = [email, password, displayName, picture]
		const {rows} = await app.pg.query(`insert into "user" (email, password, "displayName", picture)
                                       values ($1, $2, $3, $4)
                                       returning *`, values)
		return rows[0]
	})

	app.post('/users/login', async (req, res) => {
		const {email, password} = req.body
		const values = [email, password]
		const {rows, rowCount} = await app.pg.query(`select id, email, "displayName", picture
                                                 from "user"
                                                 where email = $1
                                                   and password = $2`, values)

		if (rowCount) {
			const user = rows[0]

			const token = app.jwt.sign(user, {
				subject: user.id.toString()
			})

			user.token = token

			return {user, token, message: 'create user succesfully'}
		} else {
			res.send({
				error: true,
				code: 404,
				msg: 'User not found'
			})
		}
	})
}
