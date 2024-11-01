import type { IPropsCustomRender } from '../types'
import { useEffect, useState } from 'react'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { DefaultAudioLayout, DefaultLayoutIcons, defaultLayoutIcons } from '@vidstack/react/player/layouts/default'

import { useGlobal } from '@/context/app'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/audio.css'
import clsx from 'clsx'
import { GetPreviewURL } from '../utils/handleFileList'
import Toolbar from './Toolbar'
import Loader from './Loader'

const Index = (props: IPropsCustomRender) => {
	const { file, remove, events, abort, ...rest_props } = props
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
			className={clsx(['xgen-edit-upload-preview-wrap', 'preview-audio', 'flex', 'relative'])}
			onMouseEnter={() => setShowOpration(true)}
			onMouseLeave={() => setShowOpration(false)}
		>
			<Toolbar
				loading={loading}
				events={events}
				remove={remove}
				abort={abort}
				preview={preview}
				showOpration={showOpration}
			/>

			<Loader
				loading={loading || url == ''}
				size={size}
				url={url}
				response={file.response}
				events={events}
				remove={remove}
			>
				<MediaPlayer
					style={{ height: '52px', width: size?.width || '100%' }}
					className={clsx(['mediaplayer_wrap'])}
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
			</Loader>
		</div>
	)
}

export default window.$app.memo(Index)
