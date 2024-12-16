import styles from './index.less'
import type { App } from '@/types'
import AIMessage from './AIMessage'
import HumanMessage from './HumanMessage'

interface ChatItemProps {
	chat_info: App.ChatInfo
	context: App.Context
	field: App.Field
	callback?: () => void
	avatar?: string
}

const ChatItem = ({ chat_info, context, field, callback, avatar }: ChatItemProps) => {
	const isAIMessage = (msg: App.ChatInfo): msg is App.ChatAI => msg.is_neo
	return (
		<div className={styles.content}>
			{isAIMessage(chat_info) ? (
				<AIMessage chat_info={chat_info} context={context} callback={callback} />
			) : (
				<HumanMessage chat_info={chat_info as App.ChatHuman} />
			)}
		</div>
	)
}

export default window.$app.memo(ChatItem)
