import { FC } from 'react'
import { Avatar, Button, Tooltip } from 'antd'
import { App } from '@/types'
import Tag from './Tag'
import styles from './Card.less'
import { getLocale } from '@umijs/max'
import Icon from '@/widgets/Icon'
import { useGlobal } from '@/context/app'
import { toJS } from 'mobx'
interface Props {
	/** Assistant data */
	data: App.Assistant
	/** Click handler for the card */
	onClick?: (assistant: App.Assistant) => void
	/** Chat button click handler */
	onChatClick?: (assistant: App.Assistant) => void
}

const Card: FC<Props> = ({ data, onClick, onChatClick }) => {
	// Get current locale using the same method as in useAIChat.ts
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'
	const global = useGlobal()
	const { default_assistant, connectors } = global

	// Handle chat button click without triggering the card click
	const handleChatClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		const options: App.NewChatOptions = {
			assistant: {
				assistant_id: data.assistant_id,
				assistant_name: data.name,
				assistant_avatar: data.avatar,
				assistant_deleteable: data.assistant_id !== default_assistant.assistant_id
			},
			placeholder: data.placeholder || undefined
		}

		// Trigger the new chat event
		window.$app.Event.emit('app/neoNewChat', options)
	}

	return (
		<div className={styles.card} onClick={() => onClick?.(data)}>
			<div className={styles.header}>
				<Avatar src={data.avatar} size={48} />
				<div className={styles.info}>
					<div className={styles.name}>{data.name}</div>
					<div className={styles.type}>
						{data.tags && data.tags.length > 0 ? (
							data.tags.map((tag, index) => (
								<Tag key={index} variant='auto'>
									{tag}
								</Tag>
							))
						) : (
							<Tag variant='primary'>{data.type}</Tag>
						)}
					</div>
				</div>
				<div className={styles.headerMeta}>
					<div className={styles.statusIcons}>
						{data.built_in && (
							<Tooltip title={is_cn ? '系统内建' : 'Built-in'}>
								<span className={styles.statusIcon}>
									<Icon name='icon-package' size={16} color='#b37feb' />
								</span>
							</Tooltip>
						)}
						{!data.built_in && data.readonly && (
							<Tooltip title={is_cn ? '只读' : 'Readonly'}>
								<span className={styles.statusIcon}>
									<Icon name='icon-lock' size={16} color='#faad14' />
								</span>
							</Tooltip>
						)}
						{data.mentionable && (
							<Tooltip title={is_cn ? '可提及' : 'Mentionable'}>
								<span className={styles.statusIcon}>
									<Icon name='icon-at-sign' size={16} color='#52c41a' />
								</span>
							</Tooltip>
						)}
						{data.automated && (
							<Tooltip title={is_cn ? '自动化' : 'Automated'}>
								<span className={styles.statusIcon}>
									<Icon name='icon-cpu' size={16} color='#1890ff' />
								</span>
							</Tooltip>
						)}
					</div>
				</div>
			</div>
			<div className={styles.description}>{data.description}</div>
			<div className={styles.footer}>
				<div className={styles.actions}>
					<Button
						type='primary'
						size='small'
						onClick={handleChatClick}
						className={styles.chatButton}
						icon={<Icon name='icon-message-circle' size={14} />}
					>
						{is_cn ? '聊天' : 'Chat'}
					</Button>
					{data.connector && (
						<div className={styles.connector}>{connectors.mapping[data.connector]}</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Card
