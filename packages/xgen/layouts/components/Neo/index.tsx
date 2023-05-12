import { useEventTarget, useKeyPress, useMemoizedFn } from 'ahooks'
import { Input, Button } from 'antd'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatCircleText, PaperPlaneTilt, X, ArrowsOutSimple, ArrowsInSimple, Stop } from 'phosphor-react'
import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'

import { useLocation, getLocale } from '@umijs/max'
import { local } from '@yaoapp/storex'

import { ChatItem } from './components'
import { useEventStream } from './hooks'
import styles from './index.less'

import type { IPropsNeo } from '../../types'
import type { App } from '@/types'

const { TextArea } = Input

const Index = (props: IPropsNeo) => {
	const { stack, api, studio } = props
	const locale = getLocale()
	const { pathname } = useLocation()
	const [visible, setVisible] = useState(false)
	const [max, setMax] = useState(() => local.neo_max ?? false)
	const [context, setContext] = useState<App.Context>({
		namespace: '',
		primary: '',
		data_item: {}
	})
	const ref = useRef<HTMLDivElement>(null)
	const [value, { onChange }] = useEventTarget({ initialValue: '' })
	const { messages, cmd, loading, setMessages, stop, exitCmd } = useEventStream({ api, studio })
	const is_cn = locale === 'zh-CN'

	useKeyPress('enter', () => submit())

	useEffect(() => {
		local.neo_max = max
	}, [max])

	const getContext = useMemoizedFn((ctx: App.Context) => setContext(ctx))
	const setNeoVisible = useMemoizedFn(() => setVisible(true))

	useLayoutEffect(() => {
		window.$app.Event.on('app/getContext', getContext)
		window.$app.Event.on('app/setNeoVisible', setNeoVisible)

		return () => {
			window.$app.Event.off('app/getContext', getContext)
			window.$app.Event.off('app/setNeoVisible', setNeoVisible)
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
						animate={{
							opacity: 1,
							width: max ? 720 : 360,
							height: max ? 'calc(100vh - 30px - 48px - 18px - 60px)' : 480
						}}
						exit={{ opacity: 0, width: 0, height: 0 }}
						transition={{ duration: 0.18 }}
					>
						<div className='chatbox_transition_wrap w_100 h_100 flex flex_column'>
							<div className='header_wrap w_100 border_box flex justify_between align_center'>
								<If condition={cmd?.name}>
									<Then>
										<div className='title flex flex_column'>
											<span className='cmd_title'>
												{is_cn ? '命令模式：' : 'Command mode:'}
											</span>
											<span className='cmd_name'>{cmd?.name}</span>
										</div>
										<span
											className='btn_exit_cmd cursor_point'
											onClick={exitCmd}
										>
											{is_cn ? '退出' : 'Exit'}
										</span>
									</Then>
									<Else>
										<div className='title'>
											{is_cn
												? '你好，我是Neo，你的AI业务助手'
												: 'Hello, I am Neo, your AI business assistant.'}
										</div>
										<div
											className='btn_max flex justify_center align_center clickable'
											onClick={() => setMax(!max)}
										>
											{max ? (
												<ArrowsInSimple size={16} />
											) : (
												<ArrowsOutSimple size={16} />
											)}
										</div>
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
									{loading && (
										<div className='btn_stop_wrap w_100 flex justify_center'>
											<Button
												className='flex align_center'
												icon={
													<Stop
														className='icon_stop mr_4'
														size={16}
													></Stop>
												}
												onClick={stop}
											>
												{is_cn ? '停止生成' : 'Stop generating'}
											</Button>
										</div>
									)}
								</div>
							</div>
							<div className='footer_wrap w_100 border_box flex align_center relative'>
								<TextArea
									className='input_chat flex align_center'
									placeholder={
										is_cn
											? '输入业务指令或者询问任何问题'
											: 'Input business commands or ask any questions.'
									}
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
