import { useMemoizedFn } from 'ahooks'
import clsx from 'clsx'
import { Check } from 'phosphor-react'
import { useEffect } from 'react'
import { Else, If, Then, When } from 'react-if'

import { useAction } from '@/actions'
import { NeoContent } from '@/widgets'
import { getLocale } from '@umijs/max'

import styles from './index.less'

import type { IPropsNeoChatItem } from '@/layouts/types'
import type { App } from '@/types'

const Index = (props: IPropsNeoChatItem) => {
	const { context, chat_info, callback } = props
	const { is_neo, text } = chat_info as App.ChatHuman
	const { confirm, actions } = chat_info as App.ChatAI
	const locale = getLocale()
	const onAction = useAction()
	const is_cn = locale === 'zh-CN'

	const onExecActions = useMemoizedFn(() => {
		onAction({
			...context,
			it: {
				title: '',
				icon: '',
				action: actions!
			}
		})
	})

	useEffect(() => {
		if (!actions?.length) return

		if (!confirm) {
			onExecActions()
		}
	}, [confirm, actions])

	return (
		<div
			className={clsx(
				'w_100 border_box flex',
				styles._local,
				is_neo ? styles.left_content : styles.right_content,
				is_neo && 'flex_row_reverse'
			)}
		>
			<If condition={is_neo}>
				<Then>
					<div className='chat_content w_100 border_box flex flex_column'>
						<NeoContent source={text} callback={callback}></NeoContent>
						<When condition={confirm && actions?.length}>
							<div className='confirm_wrap flex align_center justify_between'>
								<span className='text'>
									{is_cn
										? '消息包含业务指令，是否执行？'
										: 'The message contains business commands, shall I proceed with the execution?'}
								</span>
								<div
									className='btn_yes flex align_center cursor_point'
									onClick={onExecActions}
								>
									<Check className='mr_2' size={15}></Check>
									<span>{is_cn ? '执行' : 'Exec'}</span>
								</div>
							</div>
						</When>
					</div>
				</Then>
				<Else>
					<div className='chat_content border_box'>{text}</div>
				</Else>
			</If>
		</div>
	)
}

export default window.$app.memo(Index)
