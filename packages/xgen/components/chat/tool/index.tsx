import { getLocale } from '@umijs/max'
import React from 'react'
import Loading from '../loading'
import styles from './index.less'
import type { Component } from '@/types'
import { Icon } from '@/widgets'

const getTextFromHtml = (html: React.ReactNode): string => {
	if (typeof html === 'string') {
		return html
	}
	if (React.isValidElement(html)) {
		const props = html.props as { children?: React.ReactNode }
		return getTextFromHtml(props.children || '')
	}
	if (Array.isArray(html)) {
		return html.map((item) => getTextFromHtml(item)).join('')
	}
	return String(html || '')
}

interface IProps extends Component.PropsChatComponent {
	text?: string
	chat_id: string
	pending?: boolean
	children?: React.ReactNode
}

const Index = (props: IProps) => {
	const { text, chat_id, pending, children } = props
	const is_cn = getLocale() === 'zh-CN'
	let content = ''

	if (!pending) {
		content = getTextFromHtml(children) || text || (is_cn ? '工具调用请求' : 'Tool call request')
		try {
			content = content.replace(/%7B/g, '{').replace(/%7D/g, '}')
			const json = JSON.parse(content)
			if (json.function) {
				content = is_cn ? `工具调用请求: ${json.function}` : `Tool call request: ${json.function}`
			}
		} catch (error) {}
	}

	return (
		<div>
			{pending ? (
				<Loading
					chat_id={chat_id}
					placeholder={is_cn ? '工具调用请求' : 'Tool call request'}
					icon='material-slow_motion_video'
				/>
			) : (
				<div className={styles.tool}>
					<span className={styles.icon}>
						<Icon name='material-slow_motion_video' size={16} />
					</span>
					<span>{content}</span>
				</div>
			)}
		</div>
	)
}

export default window.$app.memo(Index)
