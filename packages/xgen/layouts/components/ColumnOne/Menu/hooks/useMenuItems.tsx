import { Fragment, useMemo } from 'react'

import type { IPropsMenu } from '../../../../types'
import { Icon } from '@/widgets'

const getMenuItems = (items: IPropsMenu['items']) => {
	return items.reduce(
		(total: { menu_items: Array<any>; pure_items: Array<any> }, item) => {
			const menu_item: any = {}
			const pure_item: any = {}
			if (item.badge) {
				menu_item['label'] = (
					<Fragment>
						{item.name}
						<span className='badge_wrap'>{item.badge}</span>
					</Fragment>
				)
			} else {
				menu_item['label'] = item.name
			}

			// Item icon
			if (item.icon) {
				menu_item['icon'] = <Icon name={item.icon} size={14}></Icon>
			}

			menu_item['key'] = item.key
			pure_item['key'] = item.key
			pure_item['label'] = item.name

			if (item?.children && item?.children?.length) {
				menu_item['children'] = getMenuItems(item.children).menu_items
				pure_item['children'] = getMenuItems(item.children).pure_items
			}

			total.menu_items.push(menu_item)
			total.pure_items.push(pure_item)

			return total
		},
		{ menu_items: [], pure_items: [] }
	)
}

const Index = (items: IPropsMenu['items'], prefix?: string) => {
	return useMemo(() => getMenuItems(items), [items, prefix])
}

export default Index
