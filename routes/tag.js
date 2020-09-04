export default async (app, opts) => {
	app.get('/tags', async (req, res) => {
		const {rows} = await app.pg.query(`select t.id, t.title, COUNT(t.id) as "questionCount"
                                       from tag t
                                                inner join question_tag qt on qt."tagId" = t.id
                                       group by t.id
                                       order by "questionCount" desc`)
		return rows
	})

	app.get('/tags/:tagId', async (req, res) => {
		const {tagId} = req.params
		const sql = `select t.id,
                        t.title,
                        t.description,
                        (
                            select jsonb_agg(
                                           jsonb_build_object(
                                                   'id', q.id,
                                                   'title', q.title,
                                                   'creationTime', q."creationTime",
                                                   'user', (
                                                       select jsonb_build_object(
                                                                      'id', id,
                                                                      'displayName', "displayName",
                                                                      'picture', picture)
                                                       from "user" u
                                                       where u.id = q."userId"
                                                   ),
                                                   'tags', (
                                                       select jsonb_agg(jsonb_build_object('id', t1.id, 'title', t1.title))
                                                       from tag t1
                                                       where t1.id in
                                                             (select qt2."tagId"
                                                              from question_tag qt2
                                                              where qt2."questionId" = q.id)
                                                   )
                                               ) order by q.id desc)
                            from question q
                            where q.id in (select qt."questionId" from question_tag qt where qt."tagId" = t.id)
                        ) AS "questions"
                 from tag t
                 where t.id = $1`
		const {rows} = await app.pg.query(sql, [tagId])
		return rows[0]
	})
}
