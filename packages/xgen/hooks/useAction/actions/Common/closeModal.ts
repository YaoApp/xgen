import type { OnAction } from '../../index'

type Args = Pick<OnAction, 'namespace'>

export default ({ namespace }: Args) => {
	window.$app.Event.emit(`${namespace}/back`)
}
