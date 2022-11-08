import { message } from 'antd'
import axios from 'axios'

import { getStudio } from '@/knife'

const studio = axios.create()

studio.interceptors.request.use((config) => {
	return {
		...config,
		headers: {
			...config['headers'],
			authorization: `Bearer ${getStudio().token}`
		}
	}
})

studio.interceptors.response.use(
	(response) => response.data,
	(error) => {
		const res = error.response
		const data = res.data

		if (data && data.message) {
			message.error(data.message)
		} else {
			if (res.status && res.statusText) message.error(`${res.status} : ${res.statusText}`)
		}

		return Promise.reject(error)
	}
)

export default studio
