import store from 'store2'

const Index = () => {
	const is_session_token = store.get('token_storage') === 'sessionStorage'
	const token = is_session_token ? store.session.get('token') : store.local.get('token')

	return `Bearer ${token}` || ''
}

export default Index
