import type { Component } from '@/types'
import { Item } from '@/components'

interface IFlowBuilderProps {
	setting?: any
	presets?: any
	height?: number

	value: any
	disabled?: boolean

	label?: string
	bind?: string
	namespace?: string
	type?: string
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, IFlowBuilderProps {}

const FlowBuilder = window.$app.memo((props: IProps) => {
	return <>FlowBuilder</>
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props
	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<FlowBuilder {...rest_props} {...{ __bind, __name }}></FlowBuilder>
		</Item>
	)
}

export default window.$app.memo(Index)
