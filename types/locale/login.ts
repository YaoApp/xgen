export default interface Login {
	title: string
	user_login_tip: string
	admin_login_tip: string
	no_entry: string
	auth_lark_err: string
	form: {
		validate: {
			email: string
			mobile: string
		}
	}
}
