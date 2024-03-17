import { getFileSrc } from '@/knife'
import { DeleteOutlined } from '@ant-design/icons'

import type { IPropsCustomImage } from '../types'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd'

const Index = (props: IPropsCustomImage) => {
	const { file, imageSize, remove } = props
	const [loading, setLoading] = useState<boolean>(true)
	const [url, setUrl] = useState<string>(file.response || '')

	useEffect(() => {
		if (file.response) {
			setUrl(getFileSrc(file.response))
			setLoading(false)
		}
	}, [file.response])

	return (
		<div className='upload_custom_wrap flex relative'>
			<div className='icon_delete absolute justify_center align_center transition_normal' onClick={remove}>
				<DeleteOutlined className='icon'></DeleteOutlined>
			</div>
			<Skeleton
				loading={loading || url == ''}
				active
				paragraph={{
					width: imageSize?.width || '100%'
				}}
			>
				<img
					className='image'
					src={getFileSrc(url)}
					style={{ borderRadius: 6, objectFit: 'cover', ...imageSize }}
				></img>
			</Skeleton>
		</div>
	)
}

export default window.$app.memo(Index)
