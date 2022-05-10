import type { App } from '@/types'

const Index = (arr: Array<App.Menu>, url: string): App.Menu | undefined => {
	let target

	arr.map((item) => {
		if (item.path === url) {
			target = item
		} else {
			if (item.children && item.children.length) {
				const children_target = Index(item.children, url)

				if (children_target) target = children_target
			}
		}
	})

	return target
}

export default Index
