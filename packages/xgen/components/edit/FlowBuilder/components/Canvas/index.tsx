import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon } from '@/widgets'
import { Button } from 'antd'

interface IProps {
	text: string
	icon?: string
	width?: number
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
		</div>
	)
}

export default window.$app.memo(Index)
