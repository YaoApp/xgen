import { useEventTarget, useKeyPress, useMemoizedFn } from 'ahooks'
import { Input } from 'antd'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatCircleText, PaperPlaneTilt, X } from 'phosphor-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'

import { ChatItem } from './components'
import styles from './index.less'

import type { IPropsNeo } from '../../types'

const Index = (props: IPropsNeo) => {
	const { avatar, chat_messages } = props
	const [visible, setVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const ref = useRef<HTMLDivElement>(null)
	const [value, { onChange }] = useEventTarget({ initialValue: '' })

	useKeyPress('enter', () => submit())

	useLayoutEffect(() => {
		if (!ref.current) return

		ref.current.scrollTop = 100 + ref.current.scrollHeight - ref.current.clientHeight
	}, [chat_messages])

	const callback = useMemoizedFn(() => {
		setTimeout(() => {
			if (!ref.current) return

			ref.current.scrollTop = 100 + ref.current.scrollHeight - ref.current.clientHeight
		}, 3)
	})

	const submit = useMemoizedFn(async () => {
		if (loading) return
		if (value!.length <= 3) return

		onChange({ target: { value: '' } })

		setLoading(true)

		await window.$app.Event.emit('app/chat', value)

		setLoading(false)
	})

	return (
		<div className={clsx('fixed flex flex_column align_end', styles._local)}>
			<AnimatePresence>
				{visible && (
					<motion.div
						className='chatbox_wrap flex flex_column'
						initial={{ opacity: 0, width: 0, height: 0 }}
						animate={{ opacity: 1, width: 360, height: 480 }}
						exit={{ opacity: 0, width: 0, height: 0 }}
						transition={{ duration: 0.18 }}
					>
						<div className='header_wrap w_100 border_box flex align_center'>
							<span className='title'>晚上好，我是Neo，你的AI业务助手</span>
						</div>
						<div className='content_wrap w_100 justify_end' ref={ref}>
							<div className='chat_contents w_100 border_box flex flex_column justify_end'>
								{chat_messages.map((item, index) => (
									<ChatItem
										avatar={avatar}
										chat_info={item}
										callback={callback}
										key={index}
									></ChatItem>
								))}
							</div>
						</div>
						<div className='footer_wrap w_100 border_box flex align_center relative'>
							<Input
								className='input_chat'
								placeholder='输入业务指令或者询问任何问题'
								value={value}
								onChange={onChange}
							></Input>
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
