import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon } from '@/widgets'
import { Button } from 'antd'
import Flow from '../Flow'
import { useState } from 'react'
import { IconT } from '../../types'
import { IconName, IconSize } from '../../utils'

interface IProps {
	label: string
	name?: string
	icon?: IconT
	width: number
	height: number
	showSidebar: boolean
	toggleSidebar: () => void
}

const Index = (props: IProps) => {
	return (
		<div style={{ width: props.width }}>
			<div className='head'>
				<div className='title'>
					<a onClick={props.toggleSidebar} style={{ marginRight: 6 }} className='flex align_center'>
						<Icon
							name={props.showSidebar ? 'material-first_page' : 'material-last_page'}
							size={18}
						/>
					</a>
					<Icon
						name={IconName(props.icon)}
						size={IconSize(props.icon)}
						style={{ marginRight: 4 }}
					/>
					{props.label || props.name || 'Untitled'}
				</div>
				<div className='actions'>
					<a style={{ marginRight: 12, marginTop: 2 }}>
						<Icon name='icon-play' size={14} />
					</a>
					<a style={{ marginRight: 6, marginTop: 2 }}>
						<Icon name='icon-settings' size={14} />
					</a>
					<Preset />
				</div>
			</div>
			<Flow width={props.width} height={props.height} name={props.name} />
		</div>
	)
}

export default window.$app.memo(Index)
