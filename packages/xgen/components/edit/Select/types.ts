import type { Remote } from '@/types'
import type { SelectProps } from 'antd'

export interface IProps extends Remote.IProps, SelectProps {
	extend?: boolean
}

export interface ICustom extends SelectProps {
	__name: string
	xProps: Remote.XProps
	extend?: boolean
}

export interface IPropsExtend {
	addOptionItem: (label: string, value: string) => void
}
