import Dynamic from '@/dynamic'
import { useMatch } from '@/hooks'
import { history } from '@umijs/max'

import type { Match } from '@/types'

/** Dynamically forward to the corresponding component */
const Index = () => {
	const match = useMatch<Match>('/x/:type/:model(/:id)')

	if (!match) history.push('/404')

	const { type, model, id } = match

	return <Dynamic type='base' name={type} props={{ parent: 'Page', model, id }}></Dynamic>
}

export default window.$app.memo(Index)
