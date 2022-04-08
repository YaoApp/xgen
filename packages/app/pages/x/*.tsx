import { X } from '@/components'
import { useMatch } from '@/hooks'
import { history } from '@umijs/max'

import type { Global } from '@/types'

/** Dynamically forward to the corresponding component */
const Index = () => {
	const { type, model, id } = useMatch<Global.Match>('/x/:type/:model(/:id)')

	if (!model) history.push('/404')

	return <X type='base' name={type} props={{ parent: 'Page', model, id }}></X>
}

export default window.$app.memo(Index)
