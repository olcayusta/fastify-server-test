export default async (app, opts) => {
	app.get('/search/:searchTerm', async (req, res) => {
		const {searchTerm} = req.params
		const tsQuery = `${searchTerm}:*`
		const sql = `SELECT q.id, q.title
								 FROM question q
								 WHERE to_tsvector(title) @@ to_tsquery($1)`
		const {rows} = await app.pg.query(sql, [tsQuery])
		return rows
	})
}
