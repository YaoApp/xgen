import { Input } from 'antd'

import Item from '@/components/form/Item'
import { getLocale } from '@umijs/max'

import type { InputProps, FormItemProps } from 'antd'

interface IProps extends InputProps {
	bind: string
	name: string
	itemProps?: FormItemProps
}

const Index = (props: IProps) => {
	const { bind, name, itemProps, ...rest_props } = props
	const is_cn = getLocale() === 'zh-CN'

	return (
		<Item {...itemProps} name={bind}>
			<Input
				{...rest_props}
				placeholder={
					rest_props.placeholder ||
					`${is_cn ? '请输入' : 'Please input '}${name}`
				}
			></Input>
		</Item>
	)
}

export default window.$app.memo(Index)
