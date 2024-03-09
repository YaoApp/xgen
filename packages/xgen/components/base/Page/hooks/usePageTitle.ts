import { useMemo } from 'react'

import { getItemBy } from '@/utils'

import type { GlobalModel } from '@/context/app'

export default (
	menu: GlobalModel['menu'],
	menu_selected_keys: GlobalModel['menu_selected_keys'],
	current_nav: GlobalModel['current_nav']
) => {
	return useMemo(() => {
		if (!menu_selected_keys?.length) {
			return menu[current_nav].name
		} else {
			return getItemBy('key', menu[current_nav].children || [], menu_selected_keys)?.name
		}
	}, [menu, menu_selected_keys, current_nav])
}
