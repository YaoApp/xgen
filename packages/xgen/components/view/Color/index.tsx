import { toColor } from 'react-color-palette'

import styles from './index.less'

import type { Component } from '@/types'

interface IProps extends Component.PropsViewComponent {}

const Index = (props: IProps) => {
	const { __value } = props

	if (!__value) return <span>-</span>
	if (toColor('hex', __value).hex === '#000000' && __value !== '#000000')
		return <span className={styles.error}>颜色格式不正确</span>

	return <div className={styles._local} style={{ backgroundColor: __value }}></div>
}

export default window.$app.memo(Index)
