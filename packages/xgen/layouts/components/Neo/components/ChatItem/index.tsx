import clsx from 'clsx'
import { Else, If, Then } from 'react-if'

import { NeoContent } from '@/widgets'

import styles from './index.less'

import type { IPropsNeoChatItem } from '@/layouts/types'

const Index = (props: IPropsNeoChatItem) => {
	const { chat_info, callback } = props
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
					<div className='chat_content border_box'>
						<NeoContent source={text} callback={callback}></NeoContent>
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
