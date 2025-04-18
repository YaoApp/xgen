import Icon from '@/widgets/Icon'
import styles from './index.less'
import type { App, Component } from '@/types'
import Content from './Content'
import { getLocale } from '@umijs/max'
import Loading from '@/widgets/Loading'
import { OpenDetail, UpdateDetail } from './detail'

interface AIMessageProps {
	assistant_id?: string
	chat_id: string
	chat_info: App.ChatAI
	context: App.Context
	callback?: () => void
}

const AIMessage = ({ chat_id, chat_info, context, callback }: AIMessageProps) => {
	const locale = getLocale()
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

	// Show loading status
	const show_pending = !done

	// Clickable for tool, plan, progress
	const clickable = (tool_id && tool_id != '') || (props && props.id && props.id != '')

	// Load more details
	const openDetail = () => {
		const id = props?.id || tool_id || ''
		if (!id) return
		OpenDetail(id, type, { ...props, id, text, done, locale })
	}

	// Update Detail
	if (clickable) {
		const id = props?.id || tool_id || ''
		UpdateDetail(id, type, { ...props, id, text, done, locale })
	}

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
						done={done}
						props={props as Component.PropsChatComponent}
					/>
				</div>

				{/* Loading status */}
				{show_pending && (
					<div
						className={`${clickable ? styles.actions_clickable : styles.actions}`}
						onClick={clickable ? openDetail : undefined}
					>
						<Loading size={14} />
					</div>
				)}
			</div>
		</>
	)
}

export default window.$app.memo(AIMessage)
