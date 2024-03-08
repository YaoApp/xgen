import { local, session } from '@yaoapp/storex'

const Index = (bearer: boolean = true) => {
	const is_session_token = local.token_storage === 'sessionStorage'
	const token = is_session_token ? session.token : local.token

	return (bearer ? `Bearer ${token}` : token) || ''
}

export default Index
