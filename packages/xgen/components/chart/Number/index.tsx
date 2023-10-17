import clsx from 'clsx'
import { useMemo } from 'react'
import CountUp from 'react-countup'

import { Icon } from '@/widgets'

import BaseNumber from './components/BaseNumber'
import styles from './index.less'

import type { Component } from '@/types'

export interface IProps extends Component.PropsChartComponent {
	data:
		| number
		| {
				current: number
				prev: number
		  }
	prefix?: string
	unit?: string
	decimals?: number
	prev_title?: string
}

const Index = (props: IProps) => {
	const mutaion = useMemo(() => {
		if (typeof props.data === 'number') return ''

		const duration = props.data.current - props.data.prev

		return `${duration > 0 ? '+' : '-'} ${((Math.abs(duration) * 100) / props.data.prev).toFixed(1)}`
      }, [ props.data ])
      
	if (typeof props.data === 'number') {
		return (
			<div className={clsx([styles._local, 'w_100 flex flex_column'])}>
				<BaseNumber {...props} data={props.data}></BaseNumber>
			</div>
		)
	}

	return (
		<div className={clsx([styles._local, styles.has_prev, 'w_100 flex flex_column'])}>
			<BaseNumber {...props} data={props.data.current} mutation={mutaion}></BaseNumber>
			<div className='prev_wrap flex justify_between align_center'>
				<div className='flex align_center'>
					<Icon name='icon-eye' size={16}></Icon>
					<span className='prev_title ml_4'>{props.prev_title}</span>
				</div>
				<div className='flex align_center'>
					<CountUp
						className='num'
						start={0}
						end={props.data.prev}
						duration={3}
						decimals={props.decimals || 0}
						useEasing
						separator=','
					/>
					{props.unit && <span className='unit ml_2'>{props.unit}</span>}
				</div>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
