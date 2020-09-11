import marked from 'marked'

export default async (app, opts) => {
	app.post('/answers', {
			preValidation: [app.authenticate]
		}, async (req, res) => {
			const {content, questionId} = req.body

			const userId = +req.user.sub
			const values = [marked.parse(content), userId, questionId]
			const {rows} = await app.pg.query(`INSERT INTO question_answer (content, "userId", "questionId")
																				 VALUES ($1, $2, $3)
																				 RETURNING *`, values)

			// TODO: Send notification to author (refactor)
			const notificationSql = `select "userId"
															 from question q
															 where q.id = $1`
			const usersQueryResult = await app.pg.query(notificationSql, [questionId])
			const uId = usersQueryResult.rows[0]
			console.log(uId)

			const {celebName, picture} = await socketService.sendNotification('Test 1')
			console.log(`${celebName}'in resim linki: ${picture}`)

			return rows[0]
		}
	)
}
