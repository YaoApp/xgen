import { Image } from 'antd'

import { getFileSrc } from '@yaoapp/utils'

import styles from './index.less'

import type { Component } from '@/types'
import type { ImageProps } from 'antd'

interface IProps extends Component.PropsViewComponent, ImageProps {}

const Index = (props: IProps) => {
	const { __value } = props
	const is_local = __value.indexOf('https://') !== -1

	if (Array.isArray(__value)) {
		return (
			<div className={styles._local}>
				{__value.map((item: string, index: number) => (
					<Image
						{...props}
						src={is_local ? getFileSrc(item) : item}
						key={index}
					></Image>
				))}
			</div>
		)
	}

	return (
		<div className={styles._local}>
			<Image {...props} src={is_local ? getFileSrc(__value) : __value}></Image>
		</div>
	)
}

export default window.$app.memo(Index)
