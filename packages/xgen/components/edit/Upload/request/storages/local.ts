import { UploadProps } from 'antd'
import { LocalRequestProps, IRequest, ChunkRequestParams, ChunkRequestResponse, UploadResponse } from '../types'
import { getToken } from '@/knife'
import { GetData, GetPreviewURL, ParseSize } from './utils'
import { RcFile } from 'antd/lib/upload'

import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface'
import { t } from '@wangeditor/editor'
import { run } from 'node:test'

export class LocalRequest implements IRequest {
	private xhr: XMLHttpRequest | undefined = undefined
	private canceled = false

	props: LocalRequestProps = { api: '' }

	constructor(props: LocalRequestProps) {
		this.props = props
		this.xhr = undefined
		this.canceled = false
	}

	/**
	 * Abort the request
	 */
	Abort = () => {
		this.xhr?.abort()
		this.canceled = true
	}

	/**
	 * Override the Upload method
	 * @param options
	 *      - onProgress?: (event: UploadProgressEvent) => void;
	 *      - onError?: (event: UploadRequestError | ProgressEvent, body?: T) => void;
	 *      - onSuccess?: (body: T, xhr?: XMLHttpRequest) => void;
	 *      - data?: Record<string, unknown>;
	 *      - filename?: string;
	 *      - file: Exclude<BeforeUploadFileType, File | boolean> | RcFile;
	 *      - withCredentials?: boolean;
	 *      - action: string;
	 *      - headers?: UploadRequestHeader;
	 *      - method: UploadRequestMethod;
	 * @returns
	 */
	Upload: UploadProps['customRequest'] = (options) => {
		// Chunk upload
		if (this.props.chunkSize) {
			this.uploadChunk && this.uploadChunk(options)
			return
		}

		return this.uploadFile && this.uploadFile(options)
	}

	uploadFile: UploadProps['customRequest'] = (options: RcCustomRequestOptions) => {
		const { api } = this.props
		const { file, onProgress, onError, onSuccess } = options
		const formData = new FormData()
		formData.append('file', file as File)
		if (this.props.params) {
			Object.keys(this.props.params).forEach((key) => {
				this.props.params?.[key] && formData.append(key, `${this.props.params[key]}`)
			})
		}

		const token = getToken()
		const xhr = new XMLHttpRequest()
		xhr.open('POST', api, true)
		xhr.setRequestHeader('Authorization', token)
		xhr.setRequestHeader('Content-Uid', (file as RcFile).uid)
		xhr.withCredentials = options.withCredentials || false
		xhr.upload.onprogress = (event) => {
			onProgress && onProgress(event)
		}

		xhr.onerror = (event) => {
			onError && onError(event, this.parseError(xhr))
		}

		xhr.onload = (event) => {
			if (xhr.status < 200 || xhr.status >= 300) {
				onError && onError(event, this.parseError(xhr))
				return
			}

			// Get response data
			const response = GetData(xhr, this.props.previewURL !== undefined)
			if (response.code && response.message) {
				onError && onError(event, response)
				return
			}

			// Get preview URL
			response.url = GetPreviewURL({
				response,
				token,
				previewURL: this.props.previewURL,
				useAppRoot: this.props.useAppRoot
			})

			onSuccess && onSuccess(response, xhr)
		}

		this.xhr = xhr
		xhr.send(formData)
	}

	uploadChunk: UploadProps['customRequest'] = async (options) => {
		const { onProgress, onError, onSuccess } = options
		const { api } = this.props
		!options.file && onError?.(new Error('No file to upload'))

		const token = getToken()
		const file = options.file as RcFile
		const chunkSize = ParseSize(this.props.chunkSize)
		const totalChunks = Math.ceil(file.size / chunkSize)

		// Upload each chunk
		let xhr: XMLHttpRequest | undefined = undefined
		for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
			if (this.canceled) {
				return
			}

			const start = chunkIndex * chunkSize
			const end = Math.min(file.size, start + chunkSize)
			const chunk = file.slice(start, end)
			const formData = new FormData()
			formData.append('file', chunk, file.name)

			if (this.props.params) {
				Object.keys(this.props.params).forEach((key) => {
					this.props.params?.[key] && formData.append(key, `${this.props.params[key]}`)
				})
			}
			try {
				xhr = await this.sendChunkRequest({
					uid: file.uid,
					api,
					token,
					formData,
					onProgress,
					onError,
					start,
					end,
					fileSize: file.size,
					chunkIndex,
					totalChunks
				})
				this.xhr = xhr

				// On Progress
				const event = new ProgressEvent('progress', { loaded: end, total: file.size })
				onProgress && onProgress(event)
			} catch (error: any) {
				const event = new ProgressEvent('progress', { loaded: end, total: file.size })
				onError &&
					onError(event, {
						code: error.code || 500,
						message: error && error.message ? error.message : 'Upload failed'
					})
				return
			}
		}

		if (!xhr) {
			const event = new ProgressEvent('progress', { loaded: 0, total: file.size })
			onError && onError(event, { code: 500, message: 'Upload failed' })
			return
		}

		// Get response data
		const response = GetData(xhr, this.props.previewURL !== undefined)
		if (response.code && response.message) {
			onError && onError(new Error(response.message))
			return
		}

		// Get preview URL
		response.url = GetPreviewURL({
			response,
			token,
			previewURL: this.props.previewURL,
			useAppRoot: this.props.useAppRoot
		})
		onSuccess && onSuccess(response, xhr)
	}

	// Send a chunk request
	private sendChunkRequest(params: ChunkRequestParams): Promise<XMLHttpRequest> {
		return new Promise((resolve, reject) => {
			const { api, token, formData, onProgress, onError, start, end, fileSize, chunkIndex, totalChunks } =
				params
			const xhr = new XMLHttpRequest()
			xhr.open('POST', api, true)
			xhr.setRequestHeader('Authorization', token)
			xhr.setRequestHeader('Content-Uid', params.uid)
			xhr.setRequestHeader('Content-Range', `bytes ${start}-${end - 1}/${fileSize}`)
			xhr.setRequestHeader('Content-Sync', 'true')
			xhr.withCredentials = true

			xhr.onerror = (event) => {
				reject(this.parseError(xhr))
			}

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(xhr)
				} else {
					reject(this.parseError(xhr))
				}
			}

			xhr.send(formData)
		})
	}

	private parseError = (xhr: XMLHttpRequest) => {
		if (xhr.status == 0) {
			return { code: 400, message: xhr.statusText || 'Upload failed' }
		}

		if (xhr.response && xhr.responseText) {
			try {
				const response = JSON.parse(xhr.responseText)
				if (response.code && response.message) {
					return response
				}
			} catch (error) {
				return { code: 500, message: xhr.responseText || 'Upload failed' }
			}
		}

		return { code: 500, message: xhr.responseText || xhr.statusText || 'Upload failed' }
	}
}
