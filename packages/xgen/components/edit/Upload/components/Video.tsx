import { getFileSrc } from '@/knife'

import type { IPropsCustomRender } from '../types'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd'
import { Icon } from '@/widgets'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { defaultLayoutIcons, DefaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'

import { useGlobal } from '@/context/app'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'

import styles from './Video.less'
import clsx from 'clsx'

const Index = (props: IPropsCustomRender) => {
	const { file, preivewSize, remove } = props
	const [loading, setLoading] = useState<boolean>(true)
	const [url, setUrl] = useState<string>(file.response || '')
	const [title, setTitle] = useState<string>(file.name)
	const [showOpration, setShowOpration] = useState<boolean>(false)

	const src = getFileSrc(url, props.appRoot)
	useEffect(() => {
		if (file.response) {
			const url = getFileSrc(file.response, props.appRoot)
			const title = url.split('name=/')[1]?.split('&')[0] || file.name
			setUrl(url)
			setTitle(title.split('/').pop() || file.name)
			setLoading(false)
		}
	}, [file.response])

	const preview = () => {
		window.open(src)
	}

	const global = useGlobal()
	const theme = global.theme
	const isDark = theme === 'dark'
	const icons: DefaultLayoutIcons = {
		...defaultLayoutIcons
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
				<div className='video_wrap'>
					<MediaPlayer
						style={{
							height: preivewSize?.height || '162px',
							width: preivewSize?.width
						}}
						className={clsx([styles._local])}
						title={title}
						src={src + `&${file.name}`}
					>
						<MediaProvider />
						<DefaultVideoLayout
							className={clsx(['layout'])}
							colorScheme={isDark ? 'dark' : 'light'}
							icons={icons}
						/>
					</MediaPlayer>
				</div>
			</Skeleton>
		</div>
	)
}

export default window.$app.memo(Index)
