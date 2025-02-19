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
	props?: Record<string, any>
	children?: React.ReactNode
}

const sizeHumanize = (size: number) => {
	if (size < 1024) {
		return `${size} B`
	}
	return `${(size / 1024).toFixed(2)} KB`
}

const Index = (props: IProps) => {
	const { text: text_, chat_id, pending, children, props: props_ } = props
	const is_cn = getLocale() === 'zh-CN'
	const text = props_?.text || text_
	let content = getTextFromHtml(children) || text || (is_cn ? '工具调用请求' : 'Tool call request')
	content = content
		.replace(/%7B/g, '{')
		.replace(/%7D/g, '}')
		.replace(/%22/g, '"')
		.replace(/&quot;/g, '"')

	const size = sizeHumanize(content.length)
	if (!pending) {
		// "function":"new_feature"
		// 使用正则表达式提取 function 的值,
		const function_match = content.match(/\"function\"\s*:\s*\"(\w+)\"/)
		if (function_match) {
			content = is_cn ? `工具调用请求: ${function_match[1]}` : `Tool call request: ${function_match[1]}`
		} else {
			content = is_cn ? '工具调用请求' : 'Tool call request'
		}

		// try {

		// 	const json = JSON.parse(content)
		// 	if (json.function) {
		// 		content = is_cn ? `工具调用请求: ${json.function}` : `Tool call request: ${json.function}`
		// 	}
		// } catch (error) {
		// 	console.error(content)
		// 	content = is_cn ? '工具调用请求' : 'Tool call request'
		// }
	}

	return (
		<div>
			{pending ? (
				<Loading
					chat_id={chat_id}
					placeholder={is_cn ? `工具调用请求 ${size}` : `Tool call request ${size}`}
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
