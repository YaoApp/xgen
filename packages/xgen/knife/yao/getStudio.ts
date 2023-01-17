import { local, session } from '@yaoapp/storex'

const Index = () => {
	const is_session_token = local.token_storage === 'sessionStorage'

	return is_session_token ? session.studio : local.studio
}

export default Index
