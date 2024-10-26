import type { IPropsCustomRender } from '../types'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd'
import { Icon } from '@/widgets'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { DefaultAudioLayout, DefaultLayoutIcons, defaultLayoutIcons } from '@vidstack/react/player/layouts/default'

import { useGlobal } from '@/context/app'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/audio.css'
import styles from './Audio.less'
import clsx from 'clsx'
import { GetPreviewURL } from '../utils/handleFileList'

const Index = (props: IPropsCustomRender) => {
	const { file, remove, ...rest_props } = props
	const size = rest_props.size
	const [loading, setLoading] = useState<boolean>(true)
	const [url, setUrl] = useState<string>(GetPreviewURL(file.response))
	const [title, setTitle] = useState<string>(file.name)
	const [showOpration, setShowOpration] = useState<boolean>(false)

	useEffect(() => {
		if (file.response) {
			const url = GetPreviewURL(file.response)
			const title = url.split('name=/')[1]?.split('&')[0] || file.name
			setUrl(url)
			setTitle(title.split('/').pop() || file.name)
			setLoading(false)
		}
	}, [file.response])

	const preview = () => {
		window.open(url)
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
					width: size?.width || '100%'
				}}
			>
				<MediaPlayer
					style={{ height: '52px', width: size?.width || '100%' }}
					className={clsx([styles._local])}
					title={title}
					src={url + `&${file.name}`}
				>
					<MediaProvider />
					<DefaultAudioLayout
						className={clsx(['layout'])}
						colorScheme={isDark ? 'dark' : 'light'}
						icons={icons}
					/>
				</MediaPlayer>
			</Skeleton>
		</div>
	)
}

export default window.$app.memo(Index)
