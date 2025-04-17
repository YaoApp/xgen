import { useMemoizedFn } from 'ahooks'
import { NeoContent } from '@/widgets'
import { useAction } from '@/actions'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import type { App, Component } from '@/types'
import Content from './Content'
import { getLocale } from '@umijs/max'
import { useEffect } from 'react'

interface AIMessageProps {
	assistant_id?: string
	chat_id: string
	chat_info: App.ChatAI
	context: App.Context
	callback?: () => void
}

const AIMessage = ({ chat_id, chat_info, context, callback }: AIMessageProps) => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'
	const {
		tool_id,
		text,
		props = { chat_id },
		type,
		assistant_id,
		assistant_name,
		assistant_avatar,
		done
	} = chat_info
	if (type === 'loading') {
		return (
			<Content
				assistant_id={assistant_id}
				chat_id={chat_id}
				type={type}
				props={props as Component.PropsChatComponent}
			/>
		)
	}

	const show_pending = !done

	return (
		<>
			<div className={styles.avatar}>
				{assistant_avatar ? (
					<img src={assistant_avatar} alt={assistant_name} />
				) : (
					<Icon name='material-robot_2' color='primary' />
				)}
			</div>
			<div
				className={`border_box flex ${styles.left_content}`}
				style={{
					width: type == 'text' || type == 'error' ? 'auto' : '100%'
				}}
			>
				{assistant_name && <div className={styles.assistant_name}>{assistant_name}</div>}
				<div className='chat_content border_box'>
					<Content
						tool_id={tool_id}
						type={type || 'text'}
						text={text}
						assistant_id={assistant_id}
						chat_id={chat_id}
						props={props as Component.PropsChatComponent}
					/>
				</div>
				{/* Loading status */}
				{show_pending && (
					<div
						className={styles.actions}
						onClick={() => {
							console.log('OK')
						}}
					>
						<Icon name='material-more_horiz' size={14} className='mr_2' />
						{is_cn ? '生成中' : 'Generating'}
					</div>
				)}
			</div>
		</>
	)
}

export default window.$app.memo(AIMessage)
