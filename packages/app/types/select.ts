import type { Component } from '@/types'
import type { SelectProps, CascaderProps } from 'antd'

export declare namespace SelectType {
	type type = 'Select' | 'Cascader'

	interface IProps extends Component.PropsEditComponent {
		xProps: {
			remote?: Component.Request
			search?: Component.Request & { key: string }
		}
	}

	type IPropsSelect = IProps & SelectProps
	type IPropsCascader = IProps & CascaderProps<any>
	type RawProps = IPropsSelect | IPropsCascader
	type Options = SelectProps['options'] | CascaderProps<any>['options']
}
