import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon } from '@/widgets'
import { Button } from 'antd'
import Flow from '../Flow'
import { useState } from 'react'
import { FlowValue, IconT, Setting } from '../../types'
import { IconName, IconSize } from '../../utils'
import { getLocale } from '@umijs/max'

interface IProps {
	width: number
	height: number
	value?: FlowValue
	showSidebar: boolean
	setting?: Setting
	toggleSidebar: () => void
}

const Index = (props: IProps) => {
	if (props.width === 0) return null
	if (!props.setting) return null

	const is_cn = getLocale() === 'zh-CN'
	const defaultLabel = is_cn ? '未命名' : 'Untitled'

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
						name={IconName(props.value?.icon)}
						size={IconSize(props.value?.icon)}
						style={{ marginRight: 4 }}
					/>
					{props.value?.label || props.value?.name || defaultLabel}
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
			<Flow width={props.width} height={props.height} setting={props.setting} value={props.value} />
		</div>
	)
}

export default window.$app.memo(Index)
