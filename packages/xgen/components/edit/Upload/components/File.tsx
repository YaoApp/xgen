import type { IPropsCustomRender } from '../types'
import { useEffect, useState } from 'react'
import { Icon } from '@/widgets'

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
	const [ext, setExt] = useState<string>(file.name.split('.').pop() || '')
	const [showOpration, setShowOpration] = useState<boolean>(false)

	useEffect(() => {
		if (file.response) {
			const url = GetPreviewURL(file.response)
			const title = url.split('name=/')[1]?.split('&')[0] || file.name
			setUrl(url)
			setTitle(title.split('/').pop() || file.name)
			setExt(title.split('.').pop() || '')
			setLoading(false)
		}
	}, [file.response])

	const preview = () => {
		window.open(url)
	}

	return (
		<div
			className={clsx(['xgen-edit-upload-preview-wrap', 'preview-file', 'flex', 'relative'])}
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
				<div className={clsx(['file_wrap'])} style={{ height: '52px', width: size?.width || '100%' }}>
					<Icon name='icon-file' size={20}></Icon>
					<span className='title'>
						{ext}: {title}
					</span>
				</div>
			</Loader>
		</div>
	)
}

export default window.$app.memo(Index)
