import { useDeepCompareEffect } from 'ahooks'
import { Input, Menu } from 'antd'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { Icon } from '@/widgets'
import { history } from '@umijs/max'

import { useMenuItems, useSearch } from './hooks'
import styles from './index.less'

import type { IPropsMenu } from '../../types'
import type { MenuProps } from 'antd'

const Index = (props: IPropsMenu) => {
	const { locale_messages, parent, items, menu_selected_keys, visible, show_name } = props
	const { visible_input, current_items, toggle, setInput } = useSearch(items)
	const { menu_items } = useMenuItems(current_items)
	const [openKeys, setOpenKeys] = useState<Array<string>>([])

	useDeepCompareEffect(() => {
		setOpenKeys(menu_selected_keys)
	}, [menu_selected_keys])

	const props_menu: MenuProps = {
		items: menu_items,
		mode: 'inline',
		inlineIndent: 20,
		forceSubMenuRender: true,
		selectedKeys: menu_selected_keys,
		openKeys,
		onOpenChange(openKeys) {
			setOpenKeys(openKeys)
		},
		onSelect({ key }) {
			history.push(key)
		}
	}

	return (
		<div
			className={clsx([
				show_name ? styles._local_showname : styles._local,
				(!items?.length || !visible) && styles.hidden
			])}
		>
			<div className='title_wrap w_100 border_box flex justify_between align_center relative'>
				{visible_input ? (
					<Input
						className='input'
						autoFocus
						placeholder={locale_messages.layout.menu.search_placeholder}
						onChange={({ target: { value } }) => setInput(value)}
					></Input>
				) : (
					<span className='title'>{parent?.name}</span>
				)}
				<a
					className={clsx([
						'icon_wrap flex justify_center align_center clickable',
						visible_input ? 'inputing' : ''
					])}
					onClick={() => toggle()}
				>
					{visible_input ? (
						<Icon name='icon-x' size={16}></Icon>
					) : (
						<Icon name='icon-search' size={16}></Icon>
					)}
				</a>
			</div>
			<div className='menu_wrap w_100'>
				<Menu {...props_menu}></Menu>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
