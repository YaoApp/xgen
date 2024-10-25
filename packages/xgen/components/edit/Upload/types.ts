import type { UploadProps } from 'antd'
import type { UploadFile } from 'antd/lib/upload/interface'
import type { Component } from '@/types'

interface CommonProps {
	value: Array<string>
	filetype: AllowedFileType
	desc?: string
	imageSize?: { width?: string | number; height?: string | number; ratio?: number } // will be deprecated, use previewSize instead
	previewSize?: { width?: string | number; height?: string | number; ratio?: number }
}

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
	height?: number | string // the height for the upload
	rows?: number // the rows for the upload. if set, height will be ignored
	chunkSize?: number | string // the chunk size for the upload, if set, will use the chunk upload
	previewURL?: string // the url for the preview image, if set, will use the preview image or video
	appRoot?: boolean // if false, use the data root, else use the app root, default is false
	storage?: Storage // storage option for the upload to the storage server directly (e.g. firebase, s3, etc)
	aigc?: AIGC // aigc option for the upload. if set, will use the ai generated image
}

export interface FileType {
	[key: string]: {
		listType: UploadProps<string>['listType']
		className: string
		placeholder: { [key: string]: CustomProps['placeholder'] }
		placeholderIcon: CustomProps['placeholderIcon']
		preview: (props: PreviewProps, file: UploadFile<string>, remove: () => void) => JSX.Element
	}
}

export interface IPropsCustomRender {
	file: UploadFile<string>
	appRoot?: boolean
	storage?: Storage // storage option for the upload to the storage server directly (e.g. firebase, s3, etc)
	preivewSize: CommonProps['previewSize']
	remove: () => void
}

export interface IPropsUploadBtn {
	length: number
	filetype: IProps['filetype']
	maxCount: IProps['maxCount']
	placeholder: CustomProps['placeholder']
	placeholderIcon: CustomProps['placeholderIcon']
	size: CommonProps['previewSize']
}

export interface PreviewProps {
	size?: CommonProps['previewSize']
}
