import { FC } from 'react'
import { Avatar } from 'antd'
import { App } from '@/types'
import Tag from './Tag'
import styles from './Card.less'

interface Props {
	/** Assistant data */
	data: App.Assistant
	/** Click handler for the card */
	onClick?: (assistant: App.Assistant) => void
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
