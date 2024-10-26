import type { IPropsCustomRender } from '../types'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd'
import { Icon } from '@/widgets'

import styles from './Image.less'
import clsx from 'clsx'
import { GetPreviewURL } from '../utils/handleFileList'

const Index = (props: IPropsCustomRender) => {
	const { file, remove, ...rest_props } = props
	const size = rest_props.size
	const [loading, setLoading] = useState<boolean>(true)
	const [url, setUrl] = useState<string>(GetPreviewURL(file.response))
	const [showOpration, setShowOpration] = useState<boolean>(false)

	useEffect(() => {
		if (file.response) {
			setUrl(GetPreviewURL(file.response))
			setLoading(false)
		}
	}, [file.response])

	const preview = () => {
		window.open(url)
	}

	return (
		<div
			className={clsx([styles._local, 'upload_custom_wrap', 'flex', 'relative'])}
			onMouseEnter={() => setShowOpration(true)}
			onMouseLeave={() => setShowOpration(false)}
		>
			<div className='toolbar' style={{ display: showOpration ? 'flex' : 'none' }}>
				<div className='toolbar-button' onClick={preview}>
					<Icon name='icon-download' size={16}></Icon>
				</div>
				<div className='toolbar-button' onClick={remove}>
					<Icon name='icon-trash' size={16}></Icon>
				</div>
			</div>

			<Skeleton
				loading={loading || url == ''}
				active
				paragraph={{
					width: size?.width || '100%'
				}}
			>
				<div className={clsx(['image_wrap'])}>
					<img
						className='image'
						src={url}
						style={{
							borderRadius: 6,
							objectFit: 'cover',
							...size
						}}
					></img>
				</div>
			</Skeleton>
		</div>
	)
}

export default window.$app.memo(Index)
