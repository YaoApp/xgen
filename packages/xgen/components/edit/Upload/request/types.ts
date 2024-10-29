import { UploadProps } from 'antd'
import { Storage } from '../types'
import { boolean } from 'ts-pattern/dist/patterns'
import { number } from 'echarts/core'
import { extendObservable } from 'mobx'

export interface IRequest {
	props: LocalRequestProps | S3RequestProps
	Upload: UploadProps['customRequest']
	Abort: () => void
}

export type LocalRequestProps = {
	api: string
	params?: Record<string, any>
	chunkSize?: number | string // the chunk size for the upload, if set, will use the chunk upload
	previewURL?: string // the url for the preview image, if set, will use the preview image or video
	useAppRoot?: boolean // if false, use the data root, else use the app root, default is false
	abort?: () => void
	[key: string]: any
}

export type S3RequestProps = Storage

// The upload response data
export type UploadResponse = {
	url?: string
	path?: string
	code?: number
	message?: string
	progress?: {
		total: number
		uploaded: number
		completed: boolean
	}
	uid?: string
	[key: string]: any
}

export type UploadError = { code: number; message: string }

export type PreviewParams = {
	response: UploadResponse
	token: string
	previewURL?: string
	useAppRoot?: boolean
	api?: string | { api: string; params: any }
}

export type ChunkRequestParams = {
	uid: string
	api: string
	token: string
	formData: FormData
	onProgress?: (event: ProgressEvent) => void
	onError?: (event: ProgressEvent | Error) => void
	start: number
	end: number
	fileSize: number
	chunkIndex: number
	totalChunks: number
}

export type ChunkRequestResponse = UploadResponse | string | { code: number; message: string }
