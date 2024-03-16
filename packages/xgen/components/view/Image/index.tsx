import { Image } from 'antd'
import clsx from 'clsx'

import { getFileSrc } from '@/knife'

import styles from './index.less'

import type { Component } from '@/types'
import type { ImageProps } from 'antd'

interface IProps extends Component.PropsViewComponent, ImageProps {}

const Index = (props: IProps) => {
	const { __value, onSave, ...rest_props } = props

	if (!__value) return <span>-</span>

	const props_image: ImageProps = {
		width: 48,
		height: 48,
		preview: false,
		...rest_props
	}

	if (Array.isArray(__value)) {
		if (__value.length === 0) return <span>-</span>
		return (
			<div className={styles._local}>
				{__value.map((item: string, index: number) => (
					<Image {...props_image} src={getFileSrc(item)} key={index}></Image>
				))}
			</div>
		)
	}

	return (
		<div className={styles._local}>
			<Image {...props_image} src={getFileSrc(__value)}></Image>
		</div>
	)
}

export default window.$app.memo(Index)
