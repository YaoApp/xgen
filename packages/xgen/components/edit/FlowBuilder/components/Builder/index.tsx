import Preset from '@/components/edit/FormBuilder/components/Preset'
import { Icon } from '@/widgets'
import { Button } from 'antd'
import Flow from '../Flow'
import { useEffect, useState } from 'react'
import { IconT, Setting } from '../../types'
import { IconName, IconSize } from '../../utils'
import Sidebar from '../Sidebar'
import Canvas from '../Canvas'
import { getLocale } from '@umijs/max'

interface IProps {
	label?: string
	name?: string
	icon?: IconT
	width: number
	height: number
	showSidebar: boolean
	setting?: Setting
	toggleSidebar: () => void
}

const Index = (props: IProps) => {
	if (props.width === 0) return null
	const is_cn = getLocale() === 'zh-CN'
	return (
		<div className='builder'>
			<Sidebar types={props.setting?.types} height={props.height} visible={props.showSidebar} />
			<Canvas
				toggleSidebar={props.toggleSidebar}
				showSidebar={props.showSidebar}
				height={props.height}
				width={props.width}
				label={props.label || props.name || (is_cn ? '未命名' : 'Untitled')}
				icon={props.icon}
				name={props.name}
			/>
		</div>
	)
}

export default window.$app.memo(Index)
