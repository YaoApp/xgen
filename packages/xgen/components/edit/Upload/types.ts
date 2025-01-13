import type { UploadProps } from 'antd'
import type { UploadFile } from 'antd/lib/upload/interface'
import type { Component } from '@/types'
import type { UploadProgressEvent } from 'rc-upload/lib/interface'
import { UploadError, UploadResponse } from './request/types'

interface CommonProps {
	value: Array<ValueType>
	filetype: AllowedFileType
	desc?: string
	imageSize?: { width?: string | number; height?: string | number; ratio?: number } // will be deprecated, use previewSize instead
	previewSize?: { width?: string | number; height?: string | number; ratio?: number }
}

export type ValueType = string | UploadResponse
export type AllowedFileType = 'image' | 'file' | 'video' | 'audio'

export interface Storage {
	[key: string]: any
}

export interface AIGC {
	[key: string]: any
}

export interface IProps extends UploadProps, Component.PropsEditComponent, CommonProps {
	api: string
}

export interface CustomProps extends UploadProps, CommonProps {
	api: string | { api: string; params: any }
	placeholder?: string // the placeholder for the upload
	placeholderIcon?: string | { name: string; size: number } // the placeholder icon for the upload
	maxFilesize?: number | string // the max filesize for the upload
	chunkSize?: number | string // the chunk size for the upload, if set, will use the chunk upload
	previewURL?: string // the url for the preview image, if set, will use the preview image or video
	useAppRoot?: boolean // if false, use the data root, else use the app root, default is false
	storage?: Storage // storage option for the upload to the storage server directly (e.g. firebase, s3, etc)
	__shadow?: string // if the component in the shadow dom, the value is the shadow dom name
	aigc?: AIGC // aigc option for the upload. if set, will use the ai generated image
}

export interface FileType {
	[key: string]: {
		listType: UploadProps<string>['listType']
		className: string
		placeholder: { [key: string]: CustomProps['placeholder'] }
		placeholderIcon: CustomProps['placeholderIcon']
		preview: (
			props: PreviewProps,
			file: UploadFile<ValueType>,
			remove: () => void,
			abort: () => void,
			events?: FileTypeEvents
		) => JSX.Element
	}
}

export interface FileTypeEvents {
	progress?: UploadProgressEvent
	error?: UploadError
}

export type IPropsCustomRender = {
	file: UploadFile<ValueType>
	remove: () => void
	abort: () => void
	events?: FileTypeEvents
} & PreviewProps

export type IPropsTooolbar = {
	loading: boolean
	events?: FileTypeEvents
	remove: () => void
	abort: () => void
	preview: () => void
	showOpration: boolean
	[key: string]: any
}

export interface IPropsLoader {
	loading: boolean
	url?: string
	size?: CommonProps['previewSize']
	events?: FileTypeEvents
	response?: ValueType
	children: JSX.Element
	remove: () => void
}

export interface IPropsUploadBtn {
	filetype: IProps['filetype']
	maxCount: IProps['maxCount']
	placeholder: CustomProps['placeholder']
	placeholderIcon: CustomProps['placeholderIcon']
	size: CommonProps['previewSize']
}

export type PreviewProps = {
	size?: CommonProps['previewSize']
	url?: string // the url for the download or preview
	useAppRoot?: boolean // if false, use the data root, else use the app root, default is false
	storage?: Storage // storage option for the upload to the storage server directly (e.g. firebase, s3, etc)
}
