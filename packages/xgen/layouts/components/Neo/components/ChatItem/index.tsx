import styles from './index.less'
import type { App } from '@/types'
import AIMessage from './AIMessage'
import HumanMessage from './HumanMessage'
import { useEffect, useState } from 'react'

interface ChatItemProps {
	chat_info: App.ChatInfo
	context: App.Context
	field: App.Field
	callback?: () => void
	chat_id: string
	assistant_id?: string
}

const ChatItem = ({ chat_info, context, field, callback, chat_id, assistant_id }: ChatItemProps) => {
	const isAIMessage = (msg: App.ChatInfo): msg is App.ChatAI => msg.is_neo
	return (
		<div className={styles.content}>
			{isAIMessage(chat_info) ? (
				<AIMessage
					chat_info={chat_info as App.ChatAI}
					context={context}
					callback={callback}
					chat_id={chat_id}
				/>
			) : (
				<HumanMessage chat_info={chat_info as App.ChatHuman} />
			)}
		</div>
	)
}

export default window.$app.memo(ChatItem)
