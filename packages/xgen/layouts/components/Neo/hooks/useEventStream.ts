import { useMemoizedFn } from 'ahooks'
import axios from 'axios'
import ntry from 'nice-try'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getToken } from '@/knife'

import type { App } from '@/types'

export default (api: string) => {
	const [messages, setMessages] = useState<Array<App.ChatInfo>>([])
	const [loading, setLoading] = useState(false)
	const [cmd, setCmd] = useState<App.ChatAI['command']>()
	const event_source = useRef<EventSource>()

	const neo_api = useMemo(() => (api.startsWith('http') ? api : `/api/${window.$app.api_prefix}${api}`), [api])

	const getData = useMemoizedFn((message: App.ChatHuman) => {
		setLoading(true)

		const es = new EventSource(
			`${neo_api}?content=${encodeURIComponent(message.text)}&context=${encodeURIComponent(
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

			const { text, confirm, actions, done, command } = formated_data
			const current_answer = messages[messages.length - 1] as App.ChatAI

			if (done) {
				current_answer.confirm = confirm
				current_answer.actions = actions

				setMessages(messages)

				if (command) setCmd(command)

				return setLoading(false)
			}

			if (cmd && !command) {
				current_answer.confirm = confirm
				current_answer.actions = actions

				setMessages(messages)
				setCmd(undefined)

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

	const exitCmd = useMemoizedFn(async () => {
		setCmd(undefined)

		try {
			await axios.post(`${neo_api}?token=${encodeURIComponent(getToken())}`, { cmd: 'ExitCommandMode' })
		} catch (error) {}
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

	return { messages, cmd, loading, setMessages, exitCmd }
}
