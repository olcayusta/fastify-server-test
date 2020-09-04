export default async (app, opts) => {
	app.get('/notifications', async () => {
		const {rows} = await app.pg.query('select id, "displayName", picture, "signupDate" from "user"')
		return rows
	})
}
