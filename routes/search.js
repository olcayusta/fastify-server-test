export default async (app, opts) => {
	app.get('/search/:searchTerm', async (req, res) => {
		const {searchTerm} = req.params
		const tsQuery = `${searchTerm}:*`
		const {rows} = await app.pg.query(`select q.id, q.title
                                   from question q
                                   where to_tsvector(title) @@ to_tsquery($1)`, [tsQuery])
		return rows
	})
}
