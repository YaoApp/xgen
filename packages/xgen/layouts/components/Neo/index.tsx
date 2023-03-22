import { Avatar, Input } from 'antd'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatCircleText, PaperPlaneTilt, X } from 'phosphor-react'
import { useState } from 'react'
import { Else, If, Then } from 'react-if'

import { NeoContent } from '@/widgets'

import styles from './index.less'

const Index = () => {
	const [visible, setVisible] = useState(false)

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
						<div className='content_wrap w_100 justify_end'>
							<div className='chat_contents w_100 border_box flex flex_column justify_end'>
								<div className='chat_content_wrap left_content w_100 border_box flex'>
									<Avatar
										className='avatar'
										src='https://api.dicebear.com/5.x/thumbs/svg'
									/>
									<div className='chat_content border_box'>
										<NeoContent></NeoContent>
										生成一段对话，主题是太空，不低于1000字，每段对话不低于200字生成一段对话。
									</div>
								</div>
								<div className='chat_content_wrap right_content w_100 border_box flex flex_row_reverse'>
									<Avatar
										className='avatar'
										src='https://api.dicebear.com/5.x/pixel-art/svg'
									/>
									<div className='chat_content border_box'>
										太空步行？这太疯狂了吧！我不敢想象自己在太空中漂浮的感觉是什么样的。
									</div>
								</div>
							</div>
						</div>
						<div className='footer_wrap w_100 border_box flex align_center relative'>
							<Input
								className='input_chat'
								placeholder='输入业务指令或者询问任何问题'
							></Input>
							<div className='btn_submit flex justify_center align_center absolute clickable'>
								<PaperPlaneTilt size={16}></PaperPlaneTilt>
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
