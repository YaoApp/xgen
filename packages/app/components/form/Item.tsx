import { Form } from 'antd'

import type { FormItemProps } from 'antd'

const { Item } = Form

interface IProps extends FormItemProps {
	children: JSX.Element
	name: string
	hide_label?: boolean
}

const Index = (props: IProps) => {
	const { children } = props

	const real_props = {
		label: props?.hide_label ? (
			''
		) : (
			<a id={props.name} className='disabled' href={`#${props.name}`}>
				<label>{props.name}</label>
			</a>
		),
		name: props.name,
		noStyle: !props.name
	}

	return <Item {...real_props}>{children}</Item>
}

export default window.$app.memo(Index)
