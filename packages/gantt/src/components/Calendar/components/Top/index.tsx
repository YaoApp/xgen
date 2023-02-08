import styles from './Top.css'

import type { IPropsTop } from '../../types'

const Index = (props: IPropsTop) => {
	const { value, x1Line, y1Line, y2Line, xText, yText } = props

	return (
		<g className={styles._local}>
			<line x1={x1Line} y1={y1Line} x2={x1Line} y2={y2Line} className='top_tick' key={value + 'line'} />
			<text key={value + 'text'} y={yText} x={xText} className='top_text'>
				{value}
			</text>
		</g>
	)
}

export default Index
