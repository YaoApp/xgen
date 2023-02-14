import type { IPropsProgress } from '../types'

const Index = (props: IPropsProgress) => {
	const { progressPoint, onMouseDown } = props

	return <polygon className='barHandle' points={progressPoint} onMouseDown={onMouseDown} />
}

export default Index
