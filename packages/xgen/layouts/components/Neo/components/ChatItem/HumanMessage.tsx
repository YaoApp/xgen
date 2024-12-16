import clsx from 'clsx'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import type { App } from '@/types'
import useAIChat from '../../hooks/useAIChat'

interface HumanMessageProps {
	chat_info: App.ChatHuman
}

const HumanMessage = ({ chat_info }: HumanMessageProps) => {
	const { text, attachments } = chat_info
	const { downloadFile } = useAIChat({ chat_id: chat_info.context?.chat_id })

	const handleFileClick = async (attachment: App.ChatAttachment) => {
		console.log('chat_info', chat_info)

		if (attachment.type === 'URL') {
			window.open(attachment.url, '_blank')
			return
		}

		if (attachment.file_id) {
			try {
				await downloadFile(attachment.file_id)
				return
			} catch (error) {
				console.error('Failed to download file:', error)
			}
		}

		// Others
		if (attachment.type === 'IMG' && attachment.thumbUrl) {
			window.open(attachment.thumbUrl, '_blank')
			return
		}

		if (attachment.url) {
			window.open(attachment.url, '_blank')
		}
	}

	return (
		<div className={styles.content}>
			<div className={clsx(styles.right_content)}>
				<div className='chat_content'>
					<div className={styles.message}>{text}</div>
				</div>

				{attachments && attachments.length > 0 && (
					<div className={styles.attachments}>
						{attachments.map((attachment, index) => (
							<div
								key={index}
								className={styles.attachmentItem}
								onClick={() => handleFileClick(attachment)}
							>
								{attachment.type === 'URL' ? (
									<Icon
										name='icon-link'
										size={12}
										className={styles.attachmentIcon}
									/>
								) : attachment.type === 'IMG' ? (
									<Icon
										name='icon-paperclip'
										size={12}
										className={styles.attachmentIcon}
									/>
								) : (
									<Icon
										name='icon-paperclip'
										size={12}
										className={styles.attachmentIcon}
									/>
								)}
								<span className={styles.attachmentName}>{attachment.name}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default window.$app.memo(HumanMessage)
