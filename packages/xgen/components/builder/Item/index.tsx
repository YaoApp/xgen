import { Form } from 'antd'

import type { FormItemProps } from 'antd'

import styles from './index.less'
import clsx from 'clsx'

interface IProps extends FormItemProps {
	children: JSX.Element
	__bind: string
	__name: string
	__namespace?: string
	hideLabel?: boolean
}

const Index = (props: IProps) => {
	const { children, __namespace, __bind, __name, hideLabel, ...rest_props } = props

	return (
		<div className={clsx([styles._local, 'item'])}>
			<label htmlFor={`${__namespace || ''}.${__bind}`} className='item-label'>
				{__name}
			</label>
			{children}
		</div>
	)
}

export default window.$app.memo(Index)
