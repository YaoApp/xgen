import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon } from '@/widgets'
import { Button } from 'antd'
import Flow from '../Flow'

interface IProps {
	text: string
	icon?: string
	width: number
	height: number
}

const Index = (props: IProps) => {
	return (
		<div style={{ width: props.width }}>
			<div className='head'>
				<div className='title'>
					<Icon name={props.icon || ''} size={14} style={{ marginRight: 4 }} />
					{props.text}
				</div>
				<div className='actions'>
					<a style={{ marginRight: 6, marginTop: 2 }}>
						<Icon name='icon-settings' size={14} />
					</a>
					<Preset />
				</div>
			</div>
			<Flow width={props.width} height={props.height} name={props.text} />
		</div>
	)
}

export default window.$app.memo(Index)
