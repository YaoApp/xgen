import type { FormItemProps } from 'antd'
import type { CSSProperties } from 'react'
import type { Common } from '@/types'

export declare namespace Component {
	type IdType = number
	type FormType = 'view' | 'edit'

	interface StackComponent {
		parent: 'Page' | 'Modal'
		model: string
		id?: IdType
		form?: { type: FormType }
	}

	interface FormComponent extends StackComponent {
		onBack?: () => void
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
		params?: { [key: string]: Common.DynamicValue }
	}

	interface Option {
		label: string
		value: string
		color?: string
	}

	type Options = Array<Option>
}
