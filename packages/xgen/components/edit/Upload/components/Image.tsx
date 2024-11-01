import type { IPropsCustomRender } from '../types'
import { useEffect, useState } from 'react'

import clsx from 'clsx'
import { GetPreviewURL } from '../utils/handleFileList'
import Loader from './Loader'
import Toolbar from './Toolbar'

const Index = (props: IPropsCustomRender) => {
	const { file, remove, abort, events, ...rest_props } = props
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
			className={clsx(['xgen-edit-upload-preview-wrap', 'preview-image', 'flex', 'relative'])}
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
			</Loader>
		</div>
	)
}

export default window.$app.memo(Index)
