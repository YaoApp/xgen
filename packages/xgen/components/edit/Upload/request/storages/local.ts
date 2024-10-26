import { UploadProps } from 'antd'
import { LocalRequestProps, IRequest } from '../types'
import { getToken } from '@/knife'
import { GetData, GetPreviewURL } from './utils'

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

	uploadChunk: UploadProps['customRequest'] = (options) => {}
}
