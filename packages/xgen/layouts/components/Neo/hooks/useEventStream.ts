import { useMemoizedFn } from 'ahooks'
import ntry from 'nice-try'
import { useEffect, useRef, useState } from 'react'

import { getToken } from '@/knife'

import type { App } from '@/types'

export default (api: string) => {
	const [messages, setMessages] = useState<Array<App.ChatInfo>>([])
	const [loading, setLoading] = useState(false)
	const event_source = useRef<EventSource>()

	const getData = useMemoizedFn((message: App.ChatHuman) => {
		setLoading(true)

		const es = new EventSource(
			`/api${api}?content=${encodeURIComponent(message.text)}&context=${encodeURIComponent(
				JSON.stringify(message.context)
			)}&token=${encodeURIComponent(getToken())}`
		)

		event_source.current = es

		es.onopen = () => {
			messages.push({ is_neo: true, text: '' })
		}

		es.onmessage = ({ data }: { data: string }) => {
			const formated_data = ntry(() => JSON.parse(data)) as App.ChatAI

			if (!formated_data) return

			const { text, confirm, actions, done } = formated_data
			const current_answer = messages[messages.length - 1] as App.ChatAI

			if (done) {
				current_answer.confirm = confirm
				current_answer.actions = actions

				setMessages(messages)

				return setLoading(false)
			}

			if (!text) return

			current_answer.text = current_answer.text + text

			setMessages(messages)
		}

		es.onerror = () => {
			setLoading(false)

			es.close()
		}
	})

	useEffect(() => {
		if (!messages.length) return

		const latest_message = messages.at(-1)!

		if (latest_message.is_neo) return

		getData(latest_message)
	}, [messages])

	useEffect(() => {
		return () => event_source.current?.close()
	}, [])

	return { messages, loading, setMessages }
}
