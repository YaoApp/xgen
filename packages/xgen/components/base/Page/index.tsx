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
import DevControls from './components/DevControls'
import { Else, If, Then } from 'react-if'

const Index = (props: IProps) => {
	const {
		children,
		title: page_title,
		className,
		style,
		actions = [],
		withRows,
		customAction,
		full,
		type,
		formActions
	} = props
	const global = useGlobal()
	const { layout } = global
	const title = page_title ?? usePageTitle(toJS(global.menu), toJS(global.menu_key_path), global.current_nav)

	const appEnableXterm =
		global.app_info?.mode == 'development' && global.app_info?.optional?.devControls?.enableXterm
	const appEnableAIEdit =
		global.app_info?.mode == 'development' && global.app_info?.optional?.devControls?.enableAIEdit

	const enableXterm = props.enableXterm ?? appEnableXterm
	const enableAIEdit = props.enableAIEdit ?? appEnableAIEdit

	useTitle(`${global.app_info.name} - ${global.menu[global.current_nav]?.name} - ${title}`)

	const toggleVisibleMenu = useMemoizedFn(() => (global.visible_menu = !global.visible_menu))
	const props_left: IPropsLeft = {
		title,
		visible_menu: global.visible_menu,
		layout: global.layout,
		toggleVisibleMenu
	}

	const wrap_style = full
		? ({
				padding: layout && layout == 'Admin' ? '0 60px' : '0 32px',
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
				<header
					className={clsx([
						'header w_100 border_box flex justify_between align_center',
						layout == 'Chat' ? 'header_chat' : ''
					])}
				>
					<Left {...props_left}></Left>
					<div className='options_wrap flex align_center'>
						{customAction}

						<If condition={type != 'Form'}>
							<Then>
								<Actions actions={actions}></Actions>
							</Then>
							<Else>{formActions}</Else>
						</If>

						{layout == 'Admin' && (
							<DevControls
								enableXterm={enableXterm}
								enableAIEdit={enableAIEdit}
							></DevControls>
						)}
					</div>
				</header>
				<div className='page_wrap'>{children}</div>
			</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
