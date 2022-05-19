import CountUp from 'react-countup'

import type { IProps } from '../index'

const Index = (props: IProps & { number: number }) => {
	return (
		<div className='num_wrap flex align_end'>
			{props.prefix && <span className='num'>{props.prefix}</span>}
			<CountUp
				className='num'
				start={0}
				end={props.number}
				duration={3}
				decimals={props.decimals || 0}
				useEasing
				separator=','
			/>
			{props.unit && <span className='unit'>{props.unit}</span>}
		</div>
	)
}

export default window.$app.memo(Index)
