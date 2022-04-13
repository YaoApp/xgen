import { useMemo } from 'react'

export default (
	menu_title: string,
	titlePrefix: string | undefined,
	props_title: string | undefined
) => {
	return useMemo(() => {
		if (props_title) return props_title
		if (titlePrefix) return titlePrefix + menu_title

		return menu_title
	}, [menu_title, titlePrefix, props_title])
}
