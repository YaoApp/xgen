import { App, Component } from '@/types'
import { message } from 'antd'
import { lazy, Suspense, useMemo } from 'react'

interface IProps {
	type: App.ChatMessageType
	text?: string
	props?: Component.PropsChatComponent
	assistant_id?: string
	chat_id: string
}

const Index = (props: IProps) => {
	const { type, text, props: component_props, assistant_id, chat_id } = props

	// Dynamically import the component
	const Component = useMemo(() => {
		return lazy(() => {
			const component = import(`@/components/chat/${type}`).catch(() => {
				message.error(`Component is not exist, type:'${type}' name:'${type}'`)
				console.error(`Component is not exist, type:'${type}' name:'${type}'`, props)
				return { default: () => null }
			})
			return component
		})
	}, [type])

	return (
		<Suspense fallback={null}>
			<Component text={text} assistant_id={assistant_id} chat_id={chat_id} {...component_props} />
		</Suspense>
	)
}

export default window.$app.memo(Index)
