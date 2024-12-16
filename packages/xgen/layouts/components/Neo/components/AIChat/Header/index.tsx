import { Button, Tooltip } from 'antd'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import { getLocale } from '@umijs/max'

interface HeaderProps {
	title: string
	onNew?: () => void
	onClose?: () => void
	onHistory?: () => void
	onFloat?: () => void
	buttons?: ('new' | 'history' | 'float' | 'close')[]
}

const Header = ({
	title,
	onNew,
	onClose,
	onHistory,
	onFloat,
	buttons = ['new', 'history', 'float', 'close']
}: HeaderProps) => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	const buttonConfig = {
		new: {
			title: is_cn ? '新建对话' : 'New Chat',
			icon: 'material-add',
			size: 22,
			onClick: onNew
		},
		history: {
			title: is_cn ? '历史记录' : 'History',
			icon: 'material-history',
			size: 20,
			onClick: onHistory
		},
		float: {
			title: is_cn ? '弹出窗口' : 'Pop Out',
			icon: 'material-bubbles',
			size: 20,
			onClick: onFloat
		},
		close: {
			title: is_cn ? '关闭' : 'Close',
			icon: 'material-close',
			size: 20,
			onClick: onClose
		}
	}

	return (
		<div className={styles.header}>
			<div className={styles.title}>{title}</div>
			<div className={styles.actions}>
				{buttons.map((key) => {
					const config = buttonConfig[key]
					return (
						<Tooltip key={key} title={config.title} placement='bottom'>
							<Button
								type='text'
								icon={<Icon name={config.icon} size={config.size} />}
								className={styles.actionBtn}
								onClick={config.onClick}
							/>
						</Tooltip>
					)
				})}
			</div>
		</div>
	)
}

export default Header
