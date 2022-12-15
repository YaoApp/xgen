import { history } from '@umijs/max'

export default () => {
	return () =>
		new Promise<void>((resolve) => {
			window.addEventListener('popstate', () => resolve(), { once: true })

			history.back()
		})
}
