import type { OnAction } from '../useAction'

type Args = Pick<OnAction, 'namespace'>

export default ({ namespace }: Args) => {
	return () => window.$app.Event.emit(`${namespace}/search`)
}
