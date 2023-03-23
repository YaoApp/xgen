import { Avatar } from 'antd'
import clsx from 'clsx'
import { Else, If, Then } from 'react-if'
import NiceAvatar from 'react-nice-avatar'

import { NeoContent } from '@/widgets'

import styles from './index.less'

import type { IPropsNeoChatItem } from '@/layouts/types'

const Index = (props: IPropsNeoChatItem) => {
	const { avatar, chat_info, callback } = props
	const { is_neo, text } = chat_info

	return (
		<div
			className={clsx(
				'w_100 border_box flex',
				styles._local,
				is_neo ? styles.left_content : styles.right_content,
				!is_neo && 'flex_row_reverse'
			)}
		>
			<If condition={is_neo}>
				<Then>
					<Avatar className='avatar' src='https://api.dicebear.com/5.x/thumbs/svg' />
					<div className='chat_content border_box'>
						<NeoContent source={text} callback={callback}></NeoContent>
					</div>
				</Then>
				<Else>
					<NiceAvatar className='avatar' style={{ width: 40, height: 40 }} {...avatar} />
					<div className='chat_content border_box'>{text}</div>
				</Else>
			</If>
		</div>
	)
}

export default window.$app.memo(Index)
