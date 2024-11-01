import { Form } from 'antd'

import type { FormItemProps } from 'antd'

const { Item } = Form

interface IProps extends FormItemProps {
	children: JSX.Element
	__bind: string
	__name: string
	__shadow?: string
	hideLabel?: boolean
}

const Index = (props: IProps) => {
	const { children, __bind, __name, hideLabel, ...rest_props } = props

	const Title = (
		<a id={__name} className='disabled' href={`#${__name}`}>
			<label>{__name}</label>
		</a>
	)

	const real_props = {
		label: hideLabel || props.children?.props?.__hidelabel === true ? '' : Title,
		name: __bind,
		noStyle: !__name
	}

	return (
		<Item {...real_props} {...rest_props}>
			{children}
		</Item>
	)
}

export default window.$app.memo(Index)
