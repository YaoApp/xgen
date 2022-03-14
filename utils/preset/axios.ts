import { message } from 'antd'
import axios from 'axios'

import { history } from '@umijs/pro'

axios.interceptors.request.use((config) => {
	const session = `Bearer ${sessionStorage.getItem('token')}` || ''

	return {
		...config,
		headers: {
			...config['headers'],
			authorization: session
		}
	}
})

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		const res = error.response
		const data = res.data

		if (data && (data.code === 401 || data.code === 403)) {
			const login_url = localStorage.getItem('login_url')

			if (login_url) {
				history.push(login_url)
			}

			return
		}

		if (data && data.message) {
			message.error(data.message)
		} else {
			if (res.status && res.statusText)
				message.error(`${res.status} : ${res.statusText}`, 0)
		}

		return Promise.reject(error)
	}
)
