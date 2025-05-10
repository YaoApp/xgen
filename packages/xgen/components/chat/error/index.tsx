import { WarningCircle, ArrowClockwise } from 'phosphor-react'
import styles from './index.less'
import type { Component } from '@/types'
import { getLocale } from '@umijs/max'
import { Tooltip } from 'antd'

interface IProps extends Component.PropsChatComponent {
	id?: string
	text: string
	message?: string
	onRetry?: () => void
}

const Index = (props: IProps) => {
	const { text, onRetry } = props
	const is_cn = getLocale() === 'zh-CN'
	const message = props.message || text
	const cleanErrorMessage = (message: string) => {
		return message.replace(/^Error:\s*/, '').replace(/^Exception\|\d+:\s*/, '')
	}
	return (
		<div className={styles._local}>
			<div className={styles.error_container}>
				<WarningCircle size={20} weight='fill' />
				<span className={styles.error_text}>{cleanErrorMessage(message)}</span>
				{onRetry && (
					<Tooltip title={is_cn ? '尝试修复' : 'Try to fix'}>
						<button onClick={onRetry} className={styles.retry_button}>
							<ArrowClockwise size={13} weight='bold' />
						</button>
					</Tooltip>
				)}
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
