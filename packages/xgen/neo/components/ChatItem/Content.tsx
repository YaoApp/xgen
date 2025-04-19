import { App, Component } from '@/types'
import { message } from 'antd'
import { lazy, Suspense, useMemo } from 'react'

interface IProps {
	type: App.ChatMessageType
	done?: boolean
	text?: string
	props?: Component.PropsChatComponent
	assistant_id?: string
	chat_id: string
	tool_id?: string
}

const Index = (props: IProps) => {
	const { tool_id, type, assistant_id, chat_id, done } = props
	let { props: component_props } = props

	if (!component_props) {
		component_props = { chat_id: chat_id }
	}

	// Update chat ID
	if (!component_props.chat_id) {
		component_props.chat_id = chat_id
	}

	// Update tool ID
	if (tool_id && tool_id != '' && (!component_props.id || component_props.id == '')) {
		component_props.id = tool_id
	}

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

	// Use the text from props if it exists, otherwise use the text from the component_props
	const text = component_props.text && component_props.text.trim() !== '' ? component_props.text : props.text
	return (
		<Suspense fallback={null}>
			<Component
				{...component_props}
				tool_id={tool_id}
				assistant_id={assistant_id}
				text={text}
				chat_id={chat_id || component_props.chat_id || ''}
				done={done}
			/>
		</Suspense>
	)
}

export default window.$app.memo(Index)
