import type { FormItemProps } from 'antd'
import type { CSSProperties } from 'react'
import type { Global } from '@/types'

export declare namespace Component {
	type IdType = number
	type FormType = 'view' | 'edit'

	interface BindValue {
		form_bind: string
		form_value: any
	}

	interface BaseComponent {
		parent: 'Page' | 'Modal' | 'Form' | 'Dashboard' | 'Custom'
		model: string
		search_params?: Global.StringObject
	}

	interface StackComponent extends BaseComponent {
		id?: IdType
		form?: { type: FormType }
	}

	interface FormComponent extends StackComponent {
		onBack?: () => void
	}

	interface Props {
		__namespace: string
		__primary: string
		__type: FormType
		__bind: string
		__name: string
	}

	interface PropsEditComponent extends Props {
		style?: CSSProperties
		itemProps?: FormItemProps
	}

	interface PropsViewComponent extends Props {
		__value: any
		onSave: (v: any) => void
	}

	interface PropsChartComponent extends Omit<Props, '__namespace' | '__primary' | '__data_item'> {}

	interface Params {
		[key: string]: any
	}

	interface Request {
		api: string
		params?: { [key: string]: any }
	}

	interface Option {
		label: string
		value: string
	}

	interface TagOption {
		label: string
		value: string
		color?: string
		textColor?: string
	}

	type Options = Array<Option>
}
