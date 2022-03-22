import { Dynamic } from '@/components'
import { history, useMatch } from '@umijs/max'

/** Dynamically forward to the corresponding component */
const Index = () => {
	const match = useMatch('/x/:type/:model')

	if (!match) history.push('/404')

	const { params } = match
	const { type, model } = params

	return <Dynamic type='base' name={type} props={{ parent: 'Page', model }}></Dynamic>
}

export default window.$app.memo(Index)
