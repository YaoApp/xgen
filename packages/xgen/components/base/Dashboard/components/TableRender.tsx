import { X } from '@/components'

import type { IPropsTableRender } from '../types'
import type { Dashboard } from '@/types'

const Index = (props: IPropsTableRender) => {
	const { item } = props
	const bind = item.bind as Dashboard.TableBind

	return <X type='base' name='Table' props={{ parent: 'Dashboard', model: bind.model }}></X>
}

export default window.$app.memo(Index)
