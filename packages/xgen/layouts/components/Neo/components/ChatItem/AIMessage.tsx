import { useMemoizedFn } from 'ahooks'
import { NeoContent } from '@/widgets'
import { useAction } from '@/actions'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import type { App, Component } from '@/types'
import Content from './Content'

interface AIMessageProps {
	chat_info: App.ChatAI
	context: App.Context
	callback?: () => void
}

const AIMessage = ({ chat_info, context, callback }: AIMessageProps) => {
	const { text, props, type, actions, assistant_name, assistant_avatar } = chat_info
	const onAction = useAction()

	const onExecActions = useMemoizedFn(() => {
		onAction({ ...context, it: { title: '', icon: '', action: actions! } })
	})

	// Function message (function call)
	if (type === 'function') {
		return <></>
	}

	if (type === 'loading') {
		return <Content type={type} props={props as Component.PropsChatComponent} />
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
						type={type || 'text'}
						text={text}
						props={props as Component.PropsChatComponent}
					/>
				</div>
			</div>
		</>
	)
}

export default window.$app.memo(AIMessage)
