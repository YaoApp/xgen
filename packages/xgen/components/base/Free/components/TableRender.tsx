import { X } from '@/components'

import type { IPropsTableRender } from '../types'
import type { Free } from '@/types'

const Index = (props: IPropsTableRender) => {
	const { item } = props
	const bind = item.bind as Free.TableBind

	return <X type='base' name='Table' props={{ parent: 'Free', model: bind.model }}></X>
}

export default window.$app.memo(Index)
