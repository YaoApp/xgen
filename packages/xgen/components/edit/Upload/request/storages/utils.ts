import { RcFile } from 'antd/lib/upload'
import { PreviewParams, UploadResponse } from '../types'

export function GetData(xhr: XMLHttpRequest, customPreviewURL: boolean = false): UploadResponse {
	const responseContentType = xhr.getResponseHeader('Content-Type')

	if (xhr.status < 200 || xhr.status >= 300) {
		if (xhr.status === 0) {
			return { code: 0, message: 'Network Error' }
		}

		if (responseContentType && responseContentType.indexOf('application/json') !== -1) {
			try {
				const response = JSON.parse(xhr.responseText)
				if (response.message) {
					return { code: xhr.status, message: response.message }
				}
			} catch (e) {
				return { code: xhr.status, message: `Failed to parse response ${e}` }
			}
		}

		return { code: xhr.status, message: xhr.responseText }
	}

	// xhr.responseText is a json string
	if (responseContentType && responseContentType.indexOf('application/json') !== -1) {
		try {
			const response = JSON.parse(xhr.responseText)
			if (typeof response === 'string') {
				return { path: FixPath(response, customPreviewURL) }
			}
			if (response.code && response.message) {
				return response
			}
			return { ...response, path: FixPath(response.path, customPreviewURL) }
		} catch (e) {
			return { code: 500, message: `Failed to parse response ${e}` }
		}
	}

	// xhr.responseText is a string
	const path = xhr.responseText
	return { path: FixPath(path, customPreviewURL) }
}

export function GetPreviewURL(params: PreviewParams): string {
	const { response, token, useAppRoot } = params
	let { previewURL } = params || {}

	// Validate response
	if (response.path && typeof response.path !== 'string') {
		return ''
	}

	// Http Request
	if (!previewURL && response.path?.startsWith('http')) {
		return response.path || ''
	}

	// Default preview URL
	if (!response.path?.startsWith('http') && !response.url && !previewURL && params.api) {
		let url = typeof params.api === 'string' ? params.api : params.api.api
		if (url && url.startsWith('/api/__yao') && url.includes('/upload/fields.')) {
			url = url
				.replace('/upload/fields.', '/download/fields.')
				.replace('.edit.props/api', '')
				.replace('.view.props/api', '')
			previewURL = `${url}?name=[[ $PATH ]]&token=[[ $TOKEN ]]`
			if (useAppRoot) previewURL += '&app=1'
		}
	}

	// Custom preview URL
	if (previewURL) {
		// [[ $PATH ]] is the file path,
		// [[ $TOKEN ]] is the request token
		// [[ $EXT ]] is the file extension
		// [[ $NAME ]] is the file name
		// [[ $BASE ]] is the file base name
		// [[ $<key> ]] the rest of the key returned by the upload API
		const path = response.path || ''
		const now = new Date()
		const ts = `${now.getTime()}.${now.getMilliseconds()}.${Math.floor(Math.random() * 100000) + 1}`
		const re = /\[\[\s*\$(\w+)\s*\]\]/g
		const parts = path.split('/') || []
		const rests = typeof response != 'string' ? response : {}
		const data: Record<string, any> = {
			PATH: typeof response === 'string' ? response : response.path,
			EXT: parts[parts.length - 1].split('.').pop(),
			NAME: parts[parts.length - 1],
			BASE: parts[parts.length - 1].split('.').shift(),
			TOKEN: token,
			...rests
		}

		const url = previewURL.replace(re, (match, key) => {
			if (key in data) return `${data[key]}`
			return ''
		})

		return `${url}${url.includes('?') ? '&' : '?'}ts=${ts}`
	}

	// API Return Preview URL
	if (response.url) {
		// Appends the token to the URL
		const c = response.url.includes('?') ? '&' : '?'
		return useAppRoot ? `${response.url}${c}token=${token}&app=1` : `${response.url}${c}token=${token}`
	}

	// Use the default upload API
	const c = response.path?.includes('?') ? '&' : '?'
	return useAppRoot ? `${response.path}${c}token=${token}&app=1` : `${response.path}${c}token=${token}`
}

export function FixPath(path: string, replace: boolean): string {
	// Old version api support
	if (replace && path.startsWith('/api/__yao') && path.includes('name=')) {
		return path.split('name=')[1]
	}
	return path
}

export function ParseSize(hmSize: string | number | undefined): number {
	if (hmSize === undefined) return 1024 * 1024 // 1MB
	if (typeof hmSize === 'number') return hmSize

	const unit = hmSize.slice(-1).toUpperCase()
	const size = parseInt(hmSize.slice(0, -1), 10)
	if (isNaN(size)) throw new Error('Invalid chunk size')

	switch (unit) {
		case 'M':
			return size * 1024 * 1024 // MB
		case 'K':
			return size * 1024 // KB
		default:
			return size // bytes
	}
}
