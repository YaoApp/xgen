import store from 'store2'

import { getCurrentMenuItem } from '@/utils/filter'

export const onRouteChange = ({ location }: any) => {
	const menu = store.get('menu') || []
	const item = getCurrentMenuItem(menu, location.pathname)

	if (!window.$global) return
	if (!item) return

	if (item.path.indexOf('/0/edit') !== -1) {
		window.$global.loading = true
	}

	window.$global.visible_menu = item?.visible_menu || false
}
