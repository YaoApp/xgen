import type { App } from '@/types'

import { findPath } from '@/utils'

const Index = (itemkey_or_pathname: string, items: Array<App.Menu>) => {
	let hit = false
	let current_nav = 0
	let paths: Array<string> = []
	let keys: Array<string> = []
	// Get Path
	for (const index in items) {
		const item = items[index]
		if (item.key === itemkey_or_pathname || item.path === itemkey_or_pathname) {
			hit = true
			current_nav = Number(index)
		}

		const target_key = findPath(item.children || [], 'key', itemkey_or_pathname)
		if (target_key.length) {
			hit = true
			current_nav = Number(index)
			paths = target_key.map((item) => item.path)
			keys = target_key.map((item) => item.key)
			break
		}

		const target = findPath(item.children || [], 'path', itemkey_or_pathname)
		if (target.length) {
			hit = true
			current_nav = Number(index)
			paths = target.map((item) => item.path)
			keys = target.map((item) => item.key)
			break
		}
	}

	return { hit, current_nav, paths, keys }
}

export default Index
