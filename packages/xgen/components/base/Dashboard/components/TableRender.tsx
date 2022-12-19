import { X } from '@/components'

import type { IPropsTableRender } from '../types'

const Index = (props: IPropsTableRender) => {
	const { item } = props
	const { model } = item.view.props

	return <X type='base' name='Table' props={{ parent: 'Dashboard', model }}></X>
}

export default window.$app.memo(Index)
