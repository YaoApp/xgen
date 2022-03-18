import { history, useMatch } from '@umijs/max'

/** Dynamically forward to the corresponding component */
const Index = () => {
	const match = useMatch('/x/:type/:model')

      if (!match) history.push('/404')
      
	console.log(match)

	return <div>123</div>
}

export default window.$app.memo(Index)
