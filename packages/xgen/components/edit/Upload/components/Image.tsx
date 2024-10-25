import { getFileSrc } from '@/knife'
import { DeleteOutlined } from '@ant-design/icons'

import type { IPropsCustomRender } from '../types'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd'
import { Icon } from '@/widgets'

import styles from './Image.less'
import clsx from 'clsx'

const Index = (props: IPropsCustomRender) => {
	const { file, preivewSize, remove } = props
	const [loading, setLoading] = useState<boolean>(true)
	const [url, setUrl] = useState<string>(file.response || '')
	const [showOpration, setShowOpration] = useState<boolean>(false)
	const src = getFileSrc(url, props.appRoot)

	useEffect(() => {
		if (file.response) {
			setUrl(getFileSrc(file.response, props.appRoot))
			setLoading(false)
		}
	}, [file.response])

	const preview = () => {
		window.open(src)
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
					width: preivewSize?.width || '100%'
				}}
			>
				<div className={clsx(['image_wrap'])}>
					<img
						className='image'
						src={src}
						style={{
							borderRadius: 6,
							objectFit: 'cover',
							...preivewSize
						}}
					></img>
				</div>
			</Skeleton>
		</div>
	)
}

export default window.$app.memo(Index)
