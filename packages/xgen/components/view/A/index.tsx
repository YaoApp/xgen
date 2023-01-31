import { Tooltip } from 'antd'

import styles from './index.less'

import type { Component } from '@/types'

interface IProps extends Component.PropsViewComponent {
	href: string
}

const Index = (props: IProps) => {
	const { __value, href } = props

	return (
		<Tooltip title={`访问 ${href}`}>
			<a className={styles._local} target='_blank' href={href}>
				{__value}
			</a>
		</Tooltip>
	)
}

export default window.$app.memo(Index)
