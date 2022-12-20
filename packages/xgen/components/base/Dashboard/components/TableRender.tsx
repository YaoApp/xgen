import { X } from '@/components'

import type { IPropsTableRender } from '../types'

const Index = (props: IPropsTableRender) => {
	const { item, namespace } = props
	const { model, onChangeEvent } = item.view.props

	return (
		<X
			type='base'
			name='Table'
			props={{ parent: 'Dashboard', model, onChangeEventName: onChangeEvent ? `${namespace}/search` : '' }}
		></X>
	)
}

export default window.$app.memo(Index)
