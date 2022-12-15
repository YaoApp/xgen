import { history } from '@umijs/max'

export default () => {
	return () =>
		new Promise<void>((resolve) => {
			window.addEventListener('popstate', () => {
				console.log('back')
				resolve()
			})

			history.back()
		})
}
