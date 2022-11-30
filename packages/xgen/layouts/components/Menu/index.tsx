import { useDeepCompareEffect } from 'ahooks'
import { Input, Menu } from 'antd'
import clsx from 'clsx'
import { find } from 'lodash-es'
import { useState } from 'react'

import { Icon } from '@/widgets'
import { history } from '@umijs/max'

import { useMenuItems, useSearch } from './hooks'
import styles from './index.less'

import type { IPropsMenu } from '../../types'
import type { MenuProps } from 'antd'

const Index = (props: IPropsMenu) => {
	const { locale_messages, parent, items, menu_key_path, setMenuKeyPath } = props
	const { visible_input, current_items, toggle, setInput } = useSearch(items)
	const menu_items = useMenuItems(current_items)
	const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])
	const [openKeys, setOpenKeys] = useState<Array<string>>([])

	useDeepCompareEffect(() => {
		const target = find(menu_items, (item) => item.key.split('|')[1] === parent.path)

		setSelectedKeys([target?.key])
		setOpenKeys([])
	}, [menu_items, parent])

	const props_menu: MenuProps = {
		items: menu_items,
		mode: 'inline',
		inlineIndent: 20,
		forceSubMenuRender: true,
		defaultSelectedKeys: [menu_key_path.at(0) || ''],
		defaultOpenKeys: menu_key_path,
		selectedKeys,
		openKeys,
		onOpenChange(openKeys) {
			setOpenKeys(openKeys)
		},
		onSelect({ key, keyPath, selectedKeys }) {
			history.push(key.split('|')[1])

			setMenuKeyPath(keyPath)
			setSelectedKeys(selectedKeys)
		}
	}

	return (
		<div className={clsx([styles._local, !items?.length && styles.hidden])}>
			<div className='title_wrap w_100 border_box flex justify_between align_center relative'>
				{visible_input ? (
					<Input
						className='input'
						autoFocus
						placeholder={locale_messages.layout.menu.search_placeholder}
						onChange={({ target: { value } }) => setInput(value)}
					></Input>
				) : (
					<span className='title'>{parent.name}</span>
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
