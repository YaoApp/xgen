import store from 'store2'

const Index = () => {
	const is_session_token = store.get('token_storage') === 'sessionStorage'
	const studio = is_session_token ? store.session.get('studio') : store.local.get('studio')

	return studio
}

export default Index
