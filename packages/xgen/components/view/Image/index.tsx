import { Image } from 'antd'
import styles from './index.less'

import type { Component } from '@/types'
import type { ImageProps } from 'antd'
import { GetPreviewURL } from '@/components/edit/Upload/request/storages/utils'
import { getToken } from '@/knife'
import { useMemo, useState } from 'react'
import clsx from 'clsx'

interface IProps extends Component.PropsViewComponent, ImageProps {
	previewURL?: string
	useAppRoot?: boolean
	api?: string | { api: string; params: string }
}

const Index = (props: IProps) => {
	const { __value, onSave, api, useAppRoot, previewURL, style, ...rest_props } = props

	const [urls, setUrls] = useState<string[]>([])

	const token = getToken()
	useMemo(() => {
		if (!api) return
		const values = Array.isArray(__value) ? __value : [__value]
		values.forEach((item) => {
			const url = GetPreviewURL({
				response: { path: item || '' },
				previewURL,
				useAppRoot,
				token,
				api
			})
			setUrls((urls) => [...urls, url])
		})
	}, [api, previewURL, useAppRoot])

	if (!__value || (Array.isArray(__value) && __value.length == 0)) return <span>-</span>

	const props_image: ImageProps = {
		preview: false,
		height: '100%',
		style: { objectFit: 'cover', ...(style || {}) },
		...rest_props
	}

	return (
		<div className={clsx([styles._local, 'xgen-image'])}>
			{urls.map((url: string, index: number) => (
				<Image {...props_image} src={url} key={index}></Image>
			))}
		</div>
	)
}

export default window.$app.memo(Index)
