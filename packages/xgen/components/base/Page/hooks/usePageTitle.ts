import { useMemo } from 'react'

import type { GlobalModel } from '@/context/app'

export default (
	menu: GlobalModel['menu'],
	menu_key_path: GlobalModel['menu_key_path'],
	current_nav: GlobalModel['current_nav']
) => {
	return useMemo(() => {
		if (!menu_key_path?.length) {
			return menu[current_nav].name
		}

		return menu_key_path[0]
			.split('|')[0]
			.split('/')
			.filter((item) => item)
			.at(-1)
	}, [menu, menu_key_path, current_nav])
}
