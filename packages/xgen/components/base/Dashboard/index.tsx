import { Row } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Page } from '@/components'

import { Item } from './components'
import Model from './model'

import type { Component } from '@/types'
import type { IPropsItem } from './types'

export interface IProps extends Component.StackComponent {}

const Index = (props: IProps) => {
	const { parent, model } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init(parent, model)

		return () => {
			x.off()
		}
	}, [parent, model])

	if (!x.setting.name) return null

	const props_item: Omit<IPropsItem, 'item'> = {
		data: toJS(x.data),
		namespace: x.namespace.value
	}

	return (
		<Page title={x.setting.name} className='w_100' full={x.setting?.config?.full} withRows>
			<Row gutter={16} wrap style={{ margin: 0 }}>
				{toJS(x.columns).map((item, index: number) => (
					<Item {...{ item }} {...props_item} key={index}></Item>
				))}
			</Row>
		</Page>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
