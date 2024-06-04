import { FlowValue, Setting } from '../../types'
import Sidebar from '../Sidebar'
import Canvas from '../Canvas'
import { BuilderProvider } from '../Builder/Provider'
import { Component } from '@/types'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
	value?: FlowValue
	width: number
	height: number
	showSidebar: boolean
	setting?: Setting
	fixed: boolean
	fullscreen: boolean
	setFullscreen: (value: boolean) => void
	offsetTop: number
	removeAttribution?: boolean

	execute?: Component.Request
	presets?: Component.Request
	toggleSidebar: () => void
	onData?: (id: string, type: string, value: any) => void

	showMask: boolean
	setShowMask: Dispatch<SetStateAction<boolean>>

	id: string
	name?: string
	__namespace?: string
	__bind?: string
}

const Index = (props: IProps) => {
	if (props.width === 0) return null
	if (!props.setting) return null

	return (
		<BuilderProvider
			setting={props.setting}
			value={props.value}
			onData={props.onData}
			id={props.id}
			execute={props.execute}
			presets={props.presets}
			name={props.name}
			__bind={props.__bind}
			__namespace={props.__namespace}
			fullscreen={props.fullscreen}
			setFullscreen={props.setFullscreen}
			removeAttribution={props.removeAttribution}
			showMask={props.showMask}
			setShowMask={props.setShowMask}
		>
			<div className='builder'>
				<Sidebar
					height={props.height}
					visible={props.showSidebar}
					toggleSidebar={props.toggleSidebar}
				/>
				<Canvas {...props} />
			</div>
		</BuilderProvider>
	)
}

export default window.$app.memo(Index)
