import { UploadProps } from 'antd'
import { Storage } from '../types'

export interface IRequest {
	props: LocalRequestProps | S3RequestProps
	Upload: UploadProps['customRequest']
}

export type LocalRequestProps = {
	api: string
	params?: Record<string, any>
	chunkSize?: number | string // the chunk size for the upload, if set, will use the chunk upload
	previewURL?: string // the url for the preview image, if set, will use the preview image or video
	useAppRoot?: boolean // if false, use the data root, else use the app root, default is false
	[key: string]: any
}

export type S3RequestProps = Storage

// The upload response data
export type UploadResponse = {
	url?: string
	path?: string
	code?: number
	message?: string
	[key: string]: any
}

export type PreviewParams = {
	response: UploadResponse
	token: string
	previewURL?: string
	useAppRoot?: boolean
	api?: string | { api: string; params: any }
}
