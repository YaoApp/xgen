import { getFileSrc } from '@/knife'

import type { IPropsCustomRender } from '../types'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd'
import { Icon } from '@/widgets'

import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/audio.css'
import styles from './File.less'
import clsx from 'clsx'

const Index = (props: IPropsCustomRender) => {
	const { file, preivewSize, remove } = props
	const [loading, setLoading] = useState<boolean>(true)
	const [url, setUrl] = useState<string>(file.response || '')
	const [title, setTitle] = useState<string>(file.name)
	const [ext, setExt] = useState<string>(file.name.split('.').pop() || '')
	const [showOpration, setShowOpration] = useState<boolean>(false)

	const src = getFileSrc(url, props.appRoot)
	useEffect(() => {
		if (file.response) {
			const url = getFileSrc(file.response, props.appRoot)
			const title = url.split('name=/')[1]?.split('&')[0] || file.name
			setUrl(url)
			setTitle(title.split('/').pop() || file.name)
			setExt(title.split('.').pop() || '')
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
				<div
					className={clsx(['file_wrap'])}
					style={{ height: '60px', width: preivewSize?.width || '100%' }}
				>
					<Icon name='icon-file' size={20}></Icon>
					<span className='title'>
						{ext}: {title}
					</span>
				</div>
			</Skeleton>
		</div>
	)
}

export default window.$app.memo(Index)
