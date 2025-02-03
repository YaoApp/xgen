import Loading from '../loading'
import styles from './index.less'
import type { Component } from '@/types'

interface IProps extends Component.PropsChatComponent {
	text: string
	chat_id: string
	done?: boolean
}

const Index = (props: IProps) => {
	const { text, chat_id, done } = props
	let placeholder = 'Waiting for response'
	try {
		const json = JSON.parse(text)
		if (json.function) {
			placeholder = `${json.function}`
		}
	} catch (error) {}
	return (
		<div>
			{!done && <Loading chat_id={chat_id} placeholder={'Calling'} icon='material-slow_motion_video' />}
			<div className={styles.tool}>
				<span>{placeholder}</span>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
