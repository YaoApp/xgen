import { UploadProps } from 'antd'
import { LocalRequestProps, IRequest, ChunkRequestParams, ChunkRequestResponse, UploadResponse } from '../types'
import { getToken } from '@/knife'
import { GetData, GetPreviewURL, ParseChunkSize } from './utils'
import { RcFile } from 'antd/lib/upload'

export class LocalRequest implements IRequest {
	props: LocalRequestProps = { api: '' }

	constructor(props: LocalRequestProps) {
		this.props = props
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

		this.uploadFile && this.uploadFile(options)
	}

	uploadFile: UploadProps['customRequest'] = (options) => {
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
			onError && onError(event, xhr.responseText)
		}

		xhr.onload = (event) => {
			if (xhr.status < 200 || xhr.status >= 300) {
				onError && onError(event, xhr.responseText)
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

		xhr.send(formData)
	}

	uploadChunk: UploadProps['customRequest'] = async (options) => {
		const { onProgress, onError, onSuccess } = options
		const { api } = this.props
		!options.file && onError?.(new Error('No file to upload'))

		const token = getToken()
		const file = options.file as RcFile
		const chunkSize = ParseChunkSize(this.props.chunkSize)
		const totalChunks = Math.ceil(file.size / chunkSize)

		// Upload each chunk
		let xhr: XMLHttpRequest | undefined = undefined
		for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
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
			} catch (error) {
				const event = error as ProgressEvent
				onError && onError(event)
				return
			}
		}

		if (!xhr) {
			onError && onError(new Error('No xhr object'))
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

			xhr.upload.onprogress = (event) => {
				// const percent = ((chunkIndex + event.loaded / event.total) / totalChunks) * 100
				onProgress && onProgress(event)
			}

			xhr.onerror = (event) => {
				onError && onError(event)
				reject(new Error('Chunk upload failed'))
			}

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(xhr)
				} else {
					reject(new Error(`Chunk upload failed with status ${xhr.status}`))
				}
			}

			xhr.send(formData)
		})
	}
}
