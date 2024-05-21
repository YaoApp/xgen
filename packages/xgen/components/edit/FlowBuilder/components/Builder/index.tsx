import { FlowValue, Setting } from '../../types'
import Sidebar from '../Sidebar'
import Canvas from '../Canvas'
import { BuilderProvider } from '../Builder/Provider'

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

	name?: string
	__namespace?: string
	__bind?: string
}

const Index = (props: IProps) => {
	if (props.width === 0) return null
	if (!props.setting) return null

	return (
		<BuilderProvider setting={props.setting} value={props.value}>
			<div className='builder'>
				<Sidebar height={props.height} visible={props.showSidebar} />
				<Canvas {...props} />
			</div>
		</BuilderProvider>
	)
}

export default window.$app.memo(Index)
