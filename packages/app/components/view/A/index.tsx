import { Tooltip } from 'antd'

import { getDeepValue } from '@/knife'

import styles from './index.less'

import type { Component, Common } from '@/types'

interface IProps extends Component.PropsViewComponent {
	href: Common.DynamicValue
}

const Index = (props: IProps) => {
	const { __value, __data_item } = props
	const href = getDeepValue(props.href, __data_item) || __value

	return (
		<Tooltip title={`访问 ${href}`}>
			<a className={styles._local} target='_blank' href={href}>
				{__value}
			</a>
		</Tooltip>
	)
}

export default window.$app.memo(Index)
