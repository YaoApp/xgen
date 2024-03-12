import { X } from '@/components'
import { Card } from '@/widgets'

import type { IPropsFrameRender } from '../types'
import { Bind, Dot } from '@/utils'

const Index = (props: IPropsFrameRender) => {
	const { item, data = null } = props

	if (data === null || data === undefined) return null

	const viewProps = Bind(Dot(item.view.props), data)

	return (
		<Card
			style={{
				margin: 0,
				padding: 0,
				height: viewProps.height || '100%'
			}}
		>
			<X
				type='edit'
				name='Frame'
				props={{
					itemProps: viewProps,
					...viewProps,
					__type: 'view',
					disabled: true,
					__value: data[item.bind] || null,
					__bind: item.bind,
					__name: item.name
				}}
			></X>
		</Card>
	)
}

export default window.$app.memo(Index)
