import { useMemo } from 'react'

export default (menu_title: string, props_title: string | undefined) => {
	return useMemo(() => {
		if (props_title) return props_title

		return menu_title
	}, [menu_title, props_title])
}
