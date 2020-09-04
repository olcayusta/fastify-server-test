export default async (app, opts) => {
	app.get('/questions', async (req, res) => {
		const sql = `select q.id,
                        q."creationTime",
                        q.content,
                        q.title,
                        (
                            select jsonb_agg(
                                           jsonb_build_object('id', t.id, 'title', t.title)
                                       )
                            from tag t
                                     left join question_tag qt on t.id = qt."tagId"
                            where qt."questionId" = q.id
                        ) as tags,
                        (
                            select jsonb_build_object('id', id, 'displayName', "displayName", 'picture', picture)
                            from "user" u
                            where u.id = q."userId"
                        ) as "user"
                 from question q
                 order by q.id desc`
		const {rows} = await app.pg.query(sql)
		return rows
	})

	app.get('/questions/:questionId', async (req, res) => {
		const {questionId} = req.params
		const sql = `select q.*,
                        (select row_to_json(u)
                         from "user" u
                         where u.id = q."userId"
                        ) as "user"
                 from question q
                 where q.id = $1`
		const {rows} = await app.pg.query(sql, [questionId])
		const updateViewCount = await app.pg.query(`update question
                                                set "viewCount" = "viewCount" + 1
                                                where id = $1`, [questionId])
		return rows[0]
	})

	app.post('/questions', async (req, res) => {
		const {title, content} = req.body
		const userId = req.user.sub
		const values = [title, marked.parse(content), content, userId]
		const {rows} = await app.pg.query(`insert into "question" (title, content, "rawContent", "userId")
                                       values ($1, $2, $3, $4)`, values)
		return rows[0]
	})
}
