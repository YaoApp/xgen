import { Image } from 'antd'

import { getFileSrc } from '@/knife'

import styles from './index.less'

import type { Component } from '@/types'
import type { ImageProps } from 'antd'

interface IProps extends Component.PropsViewComponent, ImageProps { }

const Index = (props: IProps) => {
	const { __value } = props

	if (Array.isArray(__value)) {
		return (
			<div className={styles._local}>
				{__value.map((item: string, index: number) => (
					<Image
						width={48}
						height={48}
						src={getFileSrc(item)}
						key={index}
						{...props}
					></Image>
				))}
			</div>
		)
	}

	return (
		<div className={styles._local}>
			<Image width={48} height={48} src={getFileSrc(__value)} {...props}></Image>
		</div>
	)
}

export default window.$app.memo(Index)
