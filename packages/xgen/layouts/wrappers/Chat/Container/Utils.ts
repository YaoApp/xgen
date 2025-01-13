import { App } from '@/types'

export function findNavPath(current: string, menus: App.Menu[]): string {
	// Recursive search function
	const search = (path: string, items: App.Menu[]): string => {
		for (const item of items) {
			// Check if current item matches
			if (item.path === path) {
				// Found a match, return the path
				return item.path
			}

			// If there are children, search recursively
			if (item.children?.length) {
				const found = search(path, item.children)
				if (found) {
					// If match found in children, return the current top-level path
					return item.path
				}
			}
		}
		return ''
	}

	return search(current, menus)
}
