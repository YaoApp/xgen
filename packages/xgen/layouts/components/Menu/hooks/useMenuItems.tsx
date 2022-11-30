import { Fragment, useMemo } from 'react'

import type { IPropsMenu } from '../../../types'

const Index = (items: IPropsMenu['items'], prefix?: string) => {
	return useMemo(() => {
		return items.reduce(
			(total: { menu_items: Array<any>; pure_items: Array<any> }, item) => {
				const menu_item: any = {}
				const pure_item: any = {}
				const _prefix = `${prefix ?? ''}/${item.name}`
				const key = `${_prefix}|${item.path}`

				if (item.badge) {
					menu_item['label'] = (
						<Fragment>
							{item.name}
							<span className='badge_wrap'>
								{item.badge}
							</span>
						</Fragment>
					)
				} else {
					menu_item['label'] = item.name
				}
				menu_item['key'] = key

				pure_item['label'] = item.name
				pure_item['key'] = key

				if (item?.children?.length) {
					menu_item['children'] = Index(item.children, _prefix).menu_items
					pure_item['children'] = Index(item.children, _prefix).pure_items
				}

				total.menu_items.push(menu_item)
				total.pure_items.push(pure_item)

				return total
			},
			{ menu_items: [], pure_items: [] }
		)
	}, [items, prefix])
}

export default Index
