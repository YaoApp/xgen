import type { UploadProps } from 'antd'
import type { UploadFile } from 'antd/lib/upload/interface'
import type { Component } from '@/types'

interface CommonProps {
	value: Array<string>
	filetype: 'image' | 'file' | 'video'
	desc?: string
	imageSize?: { width: string; height: string; ratio?: number }
}

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
	appRoot?: boolean // if false, use the data root, else use the app root, default is false
	storage?: Storage // storage option for the upload to the storage server directly (e.g. firebase, s3, etc)
	aigc?: AIGC // aigc option for the upload. if set, will use the ai generated image
}

export interface FileType {
	[key: string]: {
		listType: UploadProps<string>['listType']
		className: string
		desc: { [key: string]: string }
		render?: UploadProps['itemRender']
	}
}

export interface IPropsCustomRender {
	file: UploadFile<string>
	remove: () => void
}

export interface IPropsCustomImage extends IPropsCustomRender {
	imageSize: CommonProps['imageSize']
	appRoot?: boolean
	storage?: Storage // storage option for the upload to the storage server directly (e.g. firebase, s3, etc)
}

export interface IPropsUploadBtn {
	length: number
	filetype: IProps['filetype']
	maxCount: IProps['maxCount']
	desc: IProps['desc']
}
