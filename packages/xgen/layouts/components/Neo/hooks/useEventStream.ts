import { useMemoizedFn } from 'ahooks'
import ntry from 'nice-try'
import { useEffect, useState } from 'react'

import { getToken } from '@/knife'

import type { App } from '@/types'

export default (api: string) => {
	const [messages, setMessages] = useState<Array<App.ChatInfo>>([])
	const [loading, setLoading] = useState(false)

	const getData = useMemoizedFn((message: App.ChatHuman) => {
		setLoading(true)

		const es = new EventSource(
			`/api${api}?content=${message.text}&context=${JSON.stringify(message.context)}&token=${getToken()}`
		)

		es.onopen = () => {
			messages.push({ is_neo: true, text: '' })
		}

		es.onmessage = ({ data }: { data: string }) => {
			const formated_data = ntry(() => JSON.parse(data)) as App.ChatAI

			if (!formated_data) return

			const { text, confirm, actions, done } = formated_data

			if (done) return setLoading(false)
			if (!text) return

			const _messages = [...messages]
			const lastest_answer = _messages[_messages.length - 1]

			lastest_answer.text = lastest_answer.text + text

			setMessages([..._messages])
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

	return { messages, loading, setMessages }
}
