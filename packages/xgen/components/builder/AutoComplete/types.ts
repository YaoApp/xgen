import type { Remote } from '@/types'
import type { SelectProps } from 'antd'

export interface IProps extends Remote.IProps, SelectProps {
	extend?: boolean
	extendValue?: boolean
	extendValuePlaceholder?: string
	extendLabelPlaceholder?: string
}

export interface ICustom extends SelectProps {
	__name: string
	__type: string
	xProps: Remote.XProps
	extend?: boolean
	getOptions?: Promise<any>
}

export interface IPropsExtend {
	addOptionItem: (label: string, value: string) => void
	valueOnly?: boolean
	valuePlaceholder?: string
	labelPlaceholder?: string
}
