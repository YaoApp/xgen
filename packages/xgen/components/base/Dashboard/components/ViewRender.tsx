import { X } from '@/components'
import { Card } from '@/widgets'

import type { IPropsViewRender } from '../types'
import { Bind, Dot } from '@/utils'

const Index = (props: IPropsViewRender) => {
	const { item, data = null } = props
	if (data === null || data === undefined) return null
	const viewProps = Bind(Dot(item.view.props), data)

	return (
		<Card title={item.name} style={item.view.props?.cardStyle} ignoreMarginBottom>
			<X
				type='view'
				name={item.view.type.split('/')[1]}
				props={{
					...viewProps,
					data,
					__value: data[item.bind] || null,
					__bind: item.bind,
					__name: item.name
				}}
			></X>
		</Card>
	)
}

export default window.$app.memo(Index)
