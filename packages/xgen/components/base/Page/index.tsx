import { useMemoizedFn, useTitle } from 'ahooks'
import clsx from 'clsx'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'

import { useGlobal } from '@/context/app'

import Actions from './components/Actions'
import Left from './components/Left'
import { usePageTitle } from './hooks'
import styles from './index.less'

import type { CSSProperties } from 'react'
import type { IProps, IPropsLeft } from './types'

const Index = (props: IProps) => {
	const { children, title: page_title, className, style, actions = [], withRows, customAction, full } = props
	const global = useGlobal()
	const title = page_title ?? usePageTitle(toJS(global.menu), toJS(global.menu_key_path), global.current_nav)

	useTitle(`${global.app_info.name} - ${global.menu[global.current_nav]?.name} - ${title}`)

	const toggleVisibleMenu = useMemoizedFn(() => (global.visible_menu = !global.visible_menu))

	const props_left: IPropsLeft = {
		title,
		visible_menu: global.visible_menu,
		toggleVisibleMenu
	}

	const wrap_style = full
		? ({
				padding: '0 60px',
				maxWidth: '100%'
		  } as CSSProperties)
		: {}

	return (
		<div
			className={clsx([styles._local, className, withRows ? styles.with_rows : '', 'relative'])}
			style={style}
		>
			<div
				id='page_content_wrap'
				className='page_content_wrap flex flex_column transition_normal'
				style={wrap_style}
			>
				<header className='header w_100 border_box flex justify_between align_center'>
					<Left {...props_left}></Left>
					<div className='options_wrap flex align_center'>
						{customAction}
						<Actions actions={actions}></Actions>
					</div>
				</header>
				<div className='page_wrap'>{children}</div>
			</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
