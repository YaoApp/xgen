import { FC } from 'react'
import { Avatar } from 'antd'
import Tag from './Tag'
import styles from './Card.less'

export interface Assistant {
	/** Unique identifier */
	id: string
	/** External assistant ID for API reference */
	assistant_id: string
	/** Assistant type (coding, writing, analysis) */
	type: string
	/** Display name */
	name: string
	/** Avatar URL */
	avatar: string
	/** Brief description of capabilities */
	description: string
	/** AI model connector (OpenAI, Claude, etc.) */
	connector: string
	/** Whether the assistant is read-only */
	readonly: boolean
	/** Whether the assistant supports automation */
	automated: boolean
	/** Whether the assistant can be mentioned in chats */
	mentionable: boolean
	/** Creation timestamp */
	created_at: string
	/** Assistant options */
	option?: Record<string, any>
	/** Assistant prompts */
	prompts?: any[]
	/** Assistant flows */
	flows?: any[]
	/** Assistant files */
	files?: any[]
	/** Assistant functions */
	functions?: any[]
	/** Assistant permissions */
	permissions?: any[]
	/** Update timestamp */
	updated_at?: string
}

interface Props {
	/** Assistant data */
	data: Assistant
	/** Click handler for the card */
	onClick?: (assistant: Assistant) => void
}

const Card: FC<Props> = ({ data, onClick }) => {
	return (
		<div className={styles.card} onClick={() => onClick?.(data)}>
			<div className={styles.header}>
				<Avatar src={data.avatar} size={48} />
				<div className={styles.info}>
					<div className={styles.name}>{data.name}</div>
					<div className={styles.type}>
						<Tag variant='primary'>{data.type}</Tag>
						{data.automated && <Tag variant='success'>Automated</Tag>}
						{data.readonly && <Tag variant='warning'>Read-only</Tag>}
					</div>
				</div>
			</div>
			<div className={styles.description}>{data.description}</div>
			<div className={styles.footer}>
				<span className={styles.date}>Created {new Date(data.created_at).toLocaleDateString()}</span>
				<span className={styles.connector}>{data.connector}</span>
			</div>
		</div>
	)
}

export default Card
