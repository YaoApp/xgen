import type { TableType } from '@/types'

type Import = TableType.Setting['header']['preset']['import']

export type IProps = Import & {
	search: () => void
}

export interface IPropsSteps {
	step: number
}

export interface IPropsStep1 {
	file_name: string
	setFileName: (v: string) => void
	next: () => void
}

export interface IPropsStep2 {
	api: IProps['api']
	file_name: string
	setPreviewPayload: (v: any) => void
}

export interface IPropsStep3 {
	api: IProps['api']
	preview_payload: any
}

export interface IPropsStep4 {
	api: IProps['api']
	preview_payload: any
}
