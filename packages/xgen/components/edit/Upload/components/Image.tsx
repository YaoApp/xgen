import { getFileSrc } from '@/knife'
import { DeleteOutlined } from '@ant-design/icons'

import type { IPropsCustomImage } from '../types'

const Index = (props: IPropsCustomImage) => {
	const { file, imageSize, remove } = props

	return (
		<div className='upload_custom_wrap flex relative'>
			<div className='icon_delete absolute justify_center align_center transition_normal' onClick={remove}>
				<DeleteOutlined className='icon'></DeleteOutlined>
			</div>
			<img
				className='image'
				src={getFileSrc(file.response!)}
				style={{ borderRadius: 6, objectFit: 'cover', ...imageSize }}
			></img>
		</div>
	)
}

export default window.$app.memo(Index)
