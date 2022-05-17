import { history } from '@umijs/max'

export default () => {
	history.back()

	setTimeout(() => {
		window.$app.Event.emit('app/updateMenuIndex')
	}, 30)
}
