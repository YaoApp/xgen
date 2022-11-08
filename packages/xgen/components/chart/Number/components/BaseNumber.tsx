import clsx from 'clsx'
import CountUp from 'react-countup'

import type { IProps } from '../index'

const Index = (props: IProps & { data: number; mutation?: string }) => {
	return (
		<div className='num_wrap flex align_end'>
			{props.prefix && <span className='num'>{props.prefix}</span>}
			<CountUp
				className='num'
				start={0}
				end={props.data}
				duration={3}
				decimals={props.decimals || 0}
				useEasing
				separator=','
			/>
			{props.unit && <span className='unit'>{props.unit}</span>}
			{props.mutation && (
				<span className={clsx(['mutaion', props.mutation.indexOf('+') !== -1 ? 'up' : 'down'])}>
					{props.mutation}%
				</span>
			)}
		</div>
	)
}

export default window.$app.memo(Index)
