import axios from 'axios'
import getToken from '@/knife/yao/getToken'

export default class Upload {
	static async File(api: string, file: File, url?: string) {
		const formData = new FormData()
		formData.append('file', file)
		try {
			const res = await axios.post<string, string>(api, formData)
			const name = res.match(/name=(.+)/)?.[1]
			const token = getToken(false)
			if (!name || name == '') {
				console.error('Upload error', res)
				return Promise.reject('Upload error')
			}

			if (url && name) {
				url = url
					.replace(/\[\[[\s\S]*\$path[\s\S]*\]\]/, name)
					.replace(/\[\[[\s\S]*\$token[\s\S]*\]\]/, token)
			}

			if (!url) {
				url = res + `&token=${token}`
			}
			return Promise.resolve({ path: name, url })
		} catch (err) {
			console.error('Upload error', err)
			return Promise.reject('Upload error')
		}
	}
}
