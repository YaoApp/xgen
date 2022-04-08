import type { FormItemProps } from 'antd'
import type { CSSProperties } from 'react'

export declare namespace Component {
	interface StackComponent {
		parent: 'Page' | 'Modal'
		model: string
	}

	interface Props {
		__namespace: string
		__primary: string
		__bind: string
		__name: string
		__data_item: any
	}

	interface PropsEditComponent extends Props {
		style?: CSSProperties
		itemProps?: FormItemProps
	}

	interface PropsViewComponent extends Props {
		__value: any
	}

	interface Params {
		[key: string]: any
	}

	interface Request {
		api: string
		params?: { [key: string]: `:${string}` | string }
	}

	interface Option {
		label: string
		value: string
		color?: string
	}

	type Options = Array<Option>
}
