import { useMatch } from '@/hooks'
import Dynamic from '@/widgets'
import { history } from '@umijs/max'

import type { Match } from '@/types'

/** Dynamically forward to the corresponding component */
const Index = () => {
	const { type, model, id } = useMatch<Match>('/x/:type/:model(/:id)')

	if (!model) history.push('/404')

	return <Dynamic type='base' name={type} props={{ parent: 'Page', model, id }}></Dynamic>
}

export default window.$app.memo(Index)
