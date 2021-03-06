import { useTitle } from 'ahooks'
import { Tooltip } from 'antd'
import clsx from 'clsx'
import { useCallback } from 'react'
import { connect, history, useIntl, useParams } from 'umi'

import { Icon } from '@/components'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import styles from './index.less'

import type { IModelApp, Dispatch } from 'umi'

interface IProps {
	children: React.ReactNode
	className?: string
	title: string
	chart?: boolean
	style?: React.CSSProperties
	options?:
		| Array<{
				title: string
				icon: string
				action?: string
				payload?: any
				onClick?: () => void
		  }>
		| JSX.Element
	visible_header: IModelApp['visible_header']
	visible_menu: IModelApp['visible_menu']
	app_info: IModelApp['app_info']
	dispatch: Dispatch
}

const Index = (props: IProps) => {
	const {
		children,
		className,
		title,
		chart,
		style,
		options = [],
		visible_header,
		visible_menu,
		app_info,
		dispatch
	} = props
	const { query } = history.location
	const params = useParams<{ id: string }>()
	const { messages } = useIntl()

	useTitle(app_info.name + ' - ' + title)

	const toggleMenu = useCallback(() => {
		dispatch({
			type: 'app/updateState',
			payload: { visible_menu: !visible_menu } as IModelApp
		})
	}, [visible_menu])

	const onAction = useCallback((type, payload) => {
		dispatch({ type, payload })
	}, [])

	return (
		<div
			className={clsx([styles._local, className, chart ? styles.chart : ''])}
			style={style}
		>
			<header
				className={clsx(
					'header w_100 border_box flex justify_between align_center',
					!visible_header ? 'invisible' : ''
				)}
			>
				<div className='left_wrap flex align_center'>
					<a
						className='icon_wrap cursor_point flex justify_center align_center transition_normal clickable'
						onClick={toggleMenu}
					>
						{visible_menu ? (
							<MenuFoldOutlined className='icon_fold' />
						) : (
							<MenuUnfoldOutlined className='icon_fold' />
						)}
					</a>
					{params.id ? (
						<span className='page_title'>
							{params.id === '0'
								? (messages as any).form.title.add
								: query?.type === 'view'
								? (messages as any).form.title.view
								: (messages as any).form.title.edit}
							{title}
						</span>
					) : (
						<span className='page_title'>{title}</span>
					)}
				</div>
				<div className='options_wrap flex align_center'>
					{Array.isArray(options)
						? !!options.length &&
						  options.map((item, index) => (
								<Tooltip
									title={item.title}
									placement='bottom'
									key={index}
								>
									<a
										className='option_item cursor_point flex justify_center align_center transition_normal clickable'
										onClick={() => {
											if (item.action) {
												onAction(
													item.action,
													item.payload
												)
											}

											if (item.onClick) {
												item.onClick()
											}
										}}
									>
										<Icon
											className='icon_option'
											name={item.icon}
											size={18}
										></Icon>
									</a>
								</Tooltip>
						  ))
						: options}
				</div>
			</header>
			<div className='page_wrap'>{children}</div>
		</div>
	)
}

const getInitialProps = ({ app }: { app: IModelApp }) => ({
	visible_header: app.visible_header,
	visible_menu: app.visible_menu,
	app_info: app.app_info
})

export default window.$app.memo(connect(getInitialProps)(Index))
