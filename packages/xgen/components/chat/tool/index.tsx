import Loading from '../loading'
import styles from './index.less'
import type { Component } from '@/types'

interface IProps extends Component.PropsChatComponent {
	text?: string
	chat_id: string
	pending?: boolean
	children?: React.ReactNode
}

const Index = (props: IProps) => {
	const { text, chat_id, pending, children } = props
	let placeholder = 'Waiting for response'
	try {
		if (text) {
			const json = JSON.parse(text)
			if (json.function) {
				placeholder = `${json.function}`
			}
		}
	} catch (error) {}
	return (
		<div>
			{pending && <Loading chat_id={chat_id} placeholder={'Calling'} icon='material-slow_motion_video' />}
			<div className={styles.tool}>
				<span>{placeholder}</span>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
