import { Tabs, Modal } from 'antd'
import { getLocale } from '@umijs/max'
import clsx from 'clsx'
import styles from './index.less'
import type { ILog, LogItem, LogTabItem } from './types'
import { Icon } from '@/widgets'
import { useState } from 'react'
import { FormatDateTime } from '@/utils'
import { AntdProvider, GlobalProvider } from '@/widgets'
import LogView from './LogView'

interface IProps {
	id: string
	logs: ILog
	title?: string
	tabItems?: LogTabItem[]
	onClose: () => void
}

interface LogContentProps extends IProps {
	activeTab: string
}

function LogContent({ logs, activeTab }: LogContentProps) {
	const is_cn = getLocale() === 'zh-CN'
	return (
		<div className={styles.logContainer}>
			<div className={styles.logContent}>
				{(() => {
					const logEntries = logs[activeTab]
					return Array.isArray(logEntries) ? (
						logEntries.map((item: LogItem, index: number) => (
							<div key={index} className={clsx(styles.logItem, styles[item.level])}>
								<span
									className={styles.datetime}
									style={{ display: item.hideDateTime ? 'none' : '' }}
								>
									{FormatDateTime(new Date(item.datetime), is_cn)}
								</span>
								<span
									className={styles.levelIcon}
									style={{ display: item.hideDateTime ? 'none' : '' }}
								>
									{item.level === 'info' && <Icon name='material-info' size={14} />}
									{item.level === 'warn' && (
										<Icon name='material-warning' size={14} />
									)}
									{item.level === 'error' && (
										<Icon name='material-dangerous' size={14} />
									)}
								</span>
								<span className={styles.message}>
									<LogView
										{...item}
										className={
											item.level === 'error'
												? styles.errorMessage
												: styles.messageContent
										}
									/>
								</span>
							</div>
						))
					) : (
						<div className={styles.emptyLog}>
							<Icon name='material-description' size={24} className={styles.icon} />
							<span>{is_cn ? '暂无日志' : 'No logs available'}</span>
						</div>
					)
				})()}
			</div>
		</div>
	)
}

const LogWindow = (props: IProps) => {
	const [isMaximized, setIsMaximized] = useState(false)
	const is_cn = getLocale() === 'zh-CN'
	const [activeTab, setActiveTab] = useState(props.tabItems?.[0]?.key || 'console')
	const tabItems = props.tabItems || [
		{
			key: 'console',
			label: is_cn ? '控制台' : 'Console',
			children: null
		},
		{
			key: 'request',
			label: is_cn ? '请求' : 'Request',
			children: null
		},
		{
			key: 'response',
			label: is_cn ? '响应' : 'Response',
			children: null
		}
	]

	return (
		<AntdProvider>
			<GlobalProvider>
				<Modal
					title={
						<div className={styles.modalHeader}>
							<div className={styles.headerTitle}>
								{props.title || (is_cn ? '日志查看器' : 'Log Viewer')}
							</div>
							<div className={styles.headerTabs}>
								<Tabs
									items={tabItems}
									className={styles.logTabs}
									activeKey={activeTab}
									onChange={setActiveTab}
								/>
							</div>
							<div className={styles.headerActions}>
								<Icon
									name={
										isMaximized
											? 'material-fullscreen_exit'
											: 'material-fullscreen'
									}
									className={styles.actionIcon}
									onClick={() => setIsMaximized(!isMaximized)}
									size={16}
								/>
								<Icon
									name='material-close'
									className={styles.actionIcon}
									onClick={props.onClose}
									size={16}
								/>
							</div>
						</div>
					}
					open={true}
					footer={null}
					onCancel={props.onClose}
					width={isMaximized ? '100vw' : 800}
					className={clsx(styles.logModal, { [styles.maximized]: isMaximized })}
					wrapClassName={isMaximized ? styles.maximizedWrapper : undefined}
					maskClosable={false}
					destroyOnClose
					prefixCls='xgen-modal'
					style={isMaximized ? { top: 0, padding: 0, maxWidth: '100vw', margin: 0 } : undefined}
					bodyStyle={{ height: isMaximized ? 'calc(100vh - 55px)' : 'auto', padding: '16px' }}
				>
					<LogContent {...props} activeTab={activeTab} />
				</Modal>
			</GlobalProvider>
		</AntdProvider>
	)
}

export default LogWindow
