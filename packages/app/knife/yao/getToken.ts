const Index = () => {
	const is_session_token = localStorage.getItem('token_storage') === 'sessionStorage'
	const token = is_session_token
		? sessionStorage.getItem('token')
		: localStorage.getItem('token')

	return `Bearer ${token}` || ''
}

export default Index
