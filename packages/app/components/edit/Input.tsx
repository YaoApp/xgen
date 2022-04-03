import { Input } from 'antd'

import Item from '@/components/edit/Item'
import { getLocale } from '@umijs/max'

import type { InputProps, FormItemProps } from 'antd'
import type { IPropsEditComponent } from '@/types'

interface IProps extends InputProps, IPropsEditComponent {
	itemProps?: FormItemProps
}

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props
	const is_cn = getLocale() === 'zh-CN'

	return (
		<Item {...itemProps} name={__bind}>
			<Input
				{...rest_props}
				placeholder={
					rest_props.placeholder ||
					`${is_cn ? '请输入' : 'Please input '}${__name}`
				}
			></Input>
		</Item>
	)
}

export default window.$app.memo(Index)
