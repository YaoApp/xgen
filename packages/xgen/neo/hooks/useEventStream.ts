import { useMemoizedFn, useAsyncEffect } from 'ahooks'
import to from 'await-to-js'
import axios from 'axios'
import ntry from 'nice-try'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getToken, getStudio } from '@/knife'

import type { App } from '@/types'

type Args = { api: string; studio?: boolean }

export default ({ api, studio }: Args) => {
	const event_source = useRef<EventSource>()
	const [messages, setMessages] = useState<Array<App.ChatInfo>>([])
	const [loading, setLoading] = useState(false)
	const [cmd, setCmd] = useState<App.ChatCmd>()
	const [commands, setCommands] = useState<Array<App.ChatCommand>>([])

	const neo_api = useMemo(() => {
		const { protocol, hostname } = window.location

		if (api.startsWith('http')) return api
		if (studio) return `${protocol}//${hostname}:${getStudio().port}${api}`

		return `/api/${window.$app.api_prefix}${api}`
	}, [api, studio])

	const studio_token = useMemo(
		() => (studio ? `&studio=${encodeURIComponent('Bearer ' + getStudio()?.token)}` : ''),
		[studio]
	)

	useAsyncEffect(async () => {
		if (!neo_api) return

		const [err, res] = await to<App.ChatHistory>(
			axios.get(`${neo_api}/history?token=${encodeURIComponent(getToken())}${studio_token}`)
		)

		if (err) return

		if (res.command) setCmd(res.command)
		if (!res?.data) return

		setMessages(res.data.map(({ role, content }) => ({ is_neo: role === 'assistant', text: content })))
	}, [neo_api, studio_token])

	useAsyncEffect(async () => {
		if (!neo_api) return

		// const [err, res] = await to<Array<App.ChatCommand>>(
		// 	axios.get(`${neo_api}/commands?token=${encodeURIComponent(getToken())}${studio_token}`)
		// )

		// if (err) return

		setCommands([])
	}, [neo_api, studio_token])

	const getData = useMemoizedFn((message: App.ChatHuman) => {
		setLoading(true)

		const es = new EventSource(
			`${neo_api}?content=${encodeURIComponent(message.text)}&context=${encodeURIComponent(
				JSON.stringify(message.context)
			)}&token=${encodeURIComponent(getToken())}${studio_token}`
		)

		event_source.current = es

		es.onopen = () => {
			messages.push({ is_neo: true, text: '' })
		}

		es.onmessage = ({ data }: { data: string }) => {
			const formated_data = ntry(() => JSON.parse(data)) as App.ChatAI

			if (!formated_data) return

			// @ts-ignore
			const { text, confirm, actions, done, command } = formated_data
			const current_answer = messages[messages.length - 1] as App.ChatAI

			if (done) {
				// @ts-ignore
				current_answer.confirm = confirm
				// @ts-ignore
				current_answer.actions = actions

				setMessages([...messages])

				if (command) setCmd(command)

				return setLoading(false)
			}

			if (cmd && !command) {
				// @ts-ignore
				current_answer.confirm = confirm
				// @ts-ignore
				current_answer.actions = actions

				setMessages([...messages])
				setCmd(undefined)

				return setLoading(false)
			}

			if (!text) return

			if (text.startsWith('\r')) {
				current_answer.text = text.replace('\r', '')
			} else {
				current_answer.text = current_answer.text + text
			}

			const message_new = [...messages]

			if (message_new.length > 0) {
				message_new[message_new.length - 1] = { ...current_answer }

				setMessages(message_new)
			}
		}

		es.onerror = () => {
			setLoading(false)

			es.close()
		}
	})

	const stop = useMemoizedFn(() => {
		setLoading(false)

		event_source.current?.close()
	})

	const exitCmd = useMemoizedFn(async () => {
		setCmd(undefined)

		try {
			await axios.post(`${neo_api}?token=${encodeURIComponent(getToken())}${studio_token}`, {
				cmd: 'ExitCommandMode'
			})
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

	return { messages, cmd, commands, loading, setMessages, stop, exitCmd }
}
