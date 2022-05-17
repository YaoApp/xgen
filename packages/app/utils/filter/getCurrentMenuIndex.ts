import type { App } from '@/types'

const Index = (
	arr: Array<App.Menu>,
	url: string,
	parent_index?: number
): { nav: number; menu: number } => {
	const target = { nav: 0, menu: 0 }

	arr.map((item, index) => {
		if (item.path === url) {
			if (parent_index !== undefined) {
				target.nav = parent_index || 0
				target.menu = index || 0
			} else {
				target.nav = index
			}
		} else {
			if (item.children && item.children.length) {
				Index(item.children, url, index)
			}
		}
	})

	return target
}

export default Index
