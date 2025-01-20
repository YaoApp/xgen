import type { FormItemProps } from 'antd'
import type { CSSProperties } from 'react'
import type { Global } from '@/types'

export declare namespace Component {
	type IdType = number | string
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
		id?: string
		form?: { type: FormType }
	}

	interface FormComponent extends StackComponent {
		parentNamespace?: string
		onBack?: () => void
	}

	interface Props {
		__namespace: string
		__primary: string
		__type: FormType
		__bind: string
		__name: string
		__shadow?: string // if the component in the shadow dom, the value is the shadow dom name
	}

	interface PropsEditComponent extends Props {
		style?: CSSProperties
		itemProps?: FormItemProps
	}

	interface PropsViewComponent extends Props {
		__value: any
		onSave: (v: any) => void
	}

	interface PropsChatComponent {
		id?: string
		text?: string
		[key: string]: any
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
		value: string | number
	}

	interface TagOption {
		label: string
		value: string | number
		color?: string
		textColor?: string
	}

	type Options = Array<Option>
}
