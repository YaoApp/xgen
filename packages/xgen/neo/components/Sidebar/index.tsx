import { Button } from 'antd'
import { Plus, X } from 'phosphor-react'
import { useState } from 'react'

import AIChat from '../AIChat'
import { mockMessages, mockContextFiles } from './mock'
import styles from './index.less'
import type { IPropsNeo } from '../../../layouts/types'

const Index = (props: IPropsNeo) => {
	const { stack, api, studio, dock } = props
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
				currentPage={'Form/Index'}
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

export default window.$app.memo(Index)
