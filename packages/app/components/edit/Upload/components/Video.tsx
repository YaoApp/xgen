import { DeleteOutlined } from '@ant-design/icons'
import { getFileSrc } from '@/knife'

import type { IPropsVideo } from '../types'

const Index = (props: IPropsVideo) => {
	const { file, remove } = props

	return (
		<div className='upload_video_wrap flex relative'>
			<div
				className='icon_delete absolute justify_center align_center transition_normal'
				onClick={remove}
			>
				<DeleteOutlined className='icon'></DeleteOutlined>
			</div>
			<video className='video' src={getFileSrc(file.response!)} controls></video>
		</div>
	)
}

export default window.$app.memo(Index)
