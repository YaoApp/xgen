import type { Component } from '@/types'
import Text from '@/components/view/Text'
type Value = string | number | Array<string | number>
type StyledValue = { value: Value; color: string }
interface IProps extends Component.PropsEditComponent {
	text?: Value | StyledValue
	weight?:
		| 'thin'
		| 'extralight'
		| 'light'
		| 'normal'
		| 'medium'
		| 'semibold'
		| 'bold'
		| 'extrabold'
		| 'black'
		| number

	color?: string
	format?: string
	height?: number
}

const Index = (props: IProps) => {
	const value = props.text || ''
	const height = props.height || 36
	return (
		<div style={{ height: height }} className='flex align_center'>
			<Text {...props} __value={value} onSave={() => {}} />
		</div>
	)
}

export default window.$app.memo(Index)
