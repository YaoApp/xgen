import AIChat from '../components/AIChat'
import styles from './index.less'
import type { IPropsNeo } from '../../../types'
import { useState } from 'react'
import { mockMessages } from '../Sidebar/mock'

const Index = (props: IPropsNeo) => {
	const [messages, setMessages] = useState<any[]>(mockMessages)
	const handleSend = (message: string, files?: any[]) => {
		setMessages([...messages, { role: 'user', content: message }])
	}

	return (
		<div className={styles.container}>
			<AIChat
				messages={messages}
				onSend={handleSend}
				title='AI Assistant'
				currentPage={'chat/index'}
				onNew={() => {
					/* handle new */
				}}
				onClose={() => {
					/* handle close */
				}}
			/>
		</div>
	)
}

export default Index
