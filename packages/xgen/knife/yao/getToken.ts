import { local, session } from '@yaoapp/storex'

const Index = () => {
	const is_session_token = local.token_storage === 'sessionStorage'
	const token = is_session_token ? session.token : local.token

	return `Bearer ${token}` || ''
}

export default Index
