import { useEventTarget, useKeyPress, useMemoizedFn } from 'ahooks'
import { Input } from 'antd'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatCircleText, PaperPlaneTilt, X } from 'phosphor-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'

import { useLocation } from '@umijs/max'

import { ChatItem } from './components'
import { useEventStream } from './hooks'
import styles from './index.less'

import type { IPropsNeo } from '../../types'
import type { App } from '@/types'

const { TextArea } = Input

const Index = (props: IPropsNeo) => {
	const { stack, api } = props
	const { pathname } = useLocation()
	const [visible, setVisible] = useState(false)
	const [context, setContext] = useState<App.Context>({
		namespace: '',
		primary: '',
		data_item: {}
	})
	const ref = useRef<HTMLDivElement>(null)
	const [value, { onChange }] = useEventTarget({ initialValue: '' })
	const { messages, cmd, loading, setMessages, exitCmd } = useEventStream(api)

	useKeyPress('enter', () => submit())

	const getContext = useMemoizedFn((ctx: App.Context) => setContext(ctx))

	useLayoutEffect(() => {
		window.$app.Event.on('app/getContext', getContext)

		return () => {
			window.$app.Event.off('app/getContext', getContext)
		}
	}, [])

	const callback = useMemoizedFn(() => {
		setTimeout(() => {
			if (!ref.current) return

			ref.current.scrollTop = 100 + ref.current.scrollHeight - ref.current.clientHeight
		}, 3)
	})

	const submit = useMemoizedFn(async () => {
		if (loading) return
		if (!value) return

		setMessages([...messages, { is_neo: false, text: value, context: { stack, pathname } }])

		setTimeout(() => {
			onChange({ target: { value: '' } })
			callback()
		}, 3)
	})

	return (
		<div className={clsx('fixed flex flex_column align_end', styles._local)}>
			<AnimatePresence>
				{visible && (
					<motion.div
						className='chatbox_wrap'
						initial={{ opacity: 0, width: 0, height: 0 }}
						animate={{ opacity: 1, width: 360, height: 480 }}
						exit={{ opacity: 0, width: 0, height: 0 }}
						transition={{ duration: 0.18 }}
					>
						<div className='chatbox_transition_wrap flex flex_column'>
							<div className='header_wrap w_100 border_box flex justify_between align_center'>
								<If condition={cmd?.name}>
									<Then>
										<div className='title flex flex_column'>
											<span className='cmd_title'>命令模式：</span>
											<span className='cmd_name'>{cmd?.name}</span>
										</div>
										<span
											className='btn_exit_cmd cursor_point'
											onClick={exitCmd}
										>
											退出
										</span>
									</Then>
									<Else>
										<div className='title'>你好，我是Neo，你的AI业务助手</div>
									</Else>
								</If>
							</div>
							<div className='content_wrap w_100 justify_end' ref={ref}>
								<div className='chat_contents w_100 border_box flex flex_column justify_end'>
									{messages.map((item, index) => (
										<ChatItem
											context={context}
											chat_info={item}
											callback={callback}
											key={index}
										></ChatItem>
									))}
								</div>
							</div>
							<div className='footer_wrap w_100 border_box flex align_center relative'>
								<TextArea
									className='input_chat flex align_center'
									placeholder='输入业务指令或者询问任何问题'
									autoSize
									value={value}
									onChange={onChange}
								></TextArea>
								<div
									className={clsx(
										'btn_submit flex justify_center align_center absolute clickable',
										loading && 'disabled'
									)}
									onClick={submit}
								>
									<If condition={!loading}>
										<Then>
											<PaperPlaneTilt size={16}></PaperPlaneTilt>
										</Then>
										<Else>
											<div className='loading_wrap flex align_center'>
												<span className='loading_dot'></span>
												<span className='loading_dot'></span>
												<span className='loading_dot'></span>
											</div>
										</Else>
									</If>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<span className='btn_chat flex justify_center align_center' onClick={() => setVisible(!visible)}>
				<If condition={visible}>
					<Then>
						<X size={24} weight='duotone'></X>
					</Then>
					<Else>
						<ChatCircleText size={24} weight='duotone'></ChatCircleText>
					</Else>
				</If>
			</span>
		</div>
	)
}

export default window.$app.memo(Index)
