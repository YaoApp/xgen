import { getFileSrc } from '@/knife'
import { DeleteOutlined } from '@ant-design/icons'

import type { IPropsCustomRender } from '../types'

const Index = (props: IPropsCustomRender) => {
	const { file, remove } = props

	return (
		<div className='upload_custom_wrap flex relative'>
			<div className='icon_delete absolute justify_center align_center transition_normal' onClick={remove}>
				<DeleteOutlined className='icon'></DeleteOutlined>
			</div>
			<video className='video' src={getFileSrc(file.response!)} controls></video>
		</div>
	)
}

export default window.$app.memo(Index)
