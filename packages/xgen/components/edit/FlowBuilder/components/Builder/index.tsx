import { FlowValue, Setting } from '../../types'
import Sidebar from '../Sidebar'
import Canvas from '../Canvas'
import { getLocale } from '@umijs/max'

interface IProps {
	value?: FlowValue
	width: number
	height: number
	showSidebar: boolean
	setting?: Setting
	fixed: boolean
	offsetTop: number
	toggleSidebar: () => void
	onDataChange?: (data: any) => void
}

const Index = (props: IProps) => {
	if (props.width === 0) return null
	if (!props.setting) return null

	return (
		<div className='builder'>
			<Sidebar types={props.setting?.types} height={props.height} visible={props.showSidebar} />
			<Canvas {...props} />
		</div>
	)
}

export default window.$app.memo(Index)
