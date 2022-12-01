import { useMemo } from 'react'

import { getItemByPath } from '@/utils'

import type { GlobalModel } from '@/context/app'

export default (
	menu: GlobalModel['menu'],
	menu_key_path: GlobalModel['menu_key_path'],
	current_nav: GlobalModel['current_nav']
) => {
	return useMemo(() => {
		if (!menu_key_path?.length) {
			return menu[current_nav].name
		} else {
			return getItemByPath(menu[current_nav].children || [], menu_key_path, 'path')?.name
		}
	}, [menu, menu_key_path, current_nav])
}
