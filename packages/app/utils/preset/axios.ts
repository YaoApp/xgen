import { message } from 'antd'
import axios from 'axios'
import store from 'store2'

import { getPath } from '@/utils'
import { history } from '@umijs/max'
import { getToken } from '@yaoapp/utils'

axios.interceptors.request.use((config) => {
	return {
		...config,
		headers: {
			...config['headers'],
			authorization: getToken()
		}
	}
})

axios.interceptors.response.use(
	(response) => response.data,
	(error) => {
		const res = error.response
		const data = res.data

		if (data && data.message) {
			message.error(data.message)
		} else {
			if (res.status && res.statusText)
				message.error(`${res.status} : ${res.statusText}`)
		}

		if (data?.code === 401 || data?.code === 403) {
			if (
				getPath(history.location.pathname) === '' ||
				getPath(history.location.pathname) === '/' ||
				getPath(history.location.pathname).indexOf('login') !== -1
			) {
				return Promise.reject(error)
			}

			history.push(store.get('login_url') || '/')
		}

		return Promise.reject(error)
	}
)

// @ts-ignore
window.$axios = axios
