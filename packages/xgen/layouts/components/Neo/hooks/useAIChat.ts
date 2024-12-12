import { useGlobal } from '@/context/app'
import { getToken } from '@/knife'
import { App } from '@/types'
import { useMemoizedFn, useAsyncEffect } from 'ahooks'
import to from 'await-to-js'
import axios from 'axios'
import ntry from 'nice-try'
import { useEffect, useMemo, useRef, useState } from 'react'

type Args = {
	/** The Chat ID **/
	chat_id?: string
}

export default ({ chat_id }: Args) => {
	const event_source = useRef<EventSource>()
	const [messages, setMessages] = useState<Array<App.ChatInfo>>([])
	const [loading, setLoading] = useState(false)

	const global = useGlobal()

	/** Get Neo API **/
	const neo_api = useMemo(() => {
		const api = global.app_info.optional?.neo?.api
		if (!api) return
		if (api.startsWith('http')) return api
		return `/api/${window.$app.api_prefix}${api}`
	}, [global.app_info.optional?.neo?.api])

	/** Get AI Chat History **/
	const getHistory = useMemoizedFn(async () => {
		if (!chat_id) return

		const endpoint = `${neo_api}/history?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}`
		const [err, res] = await to<App.ChatHistory>(axios.get(endpoint))
		if (err) return
		if (!res?.data) return
		setMessages(res.data.map(({ role, content }) => ({ is_neo: role === 'assistant', text: content })))
	})

	/** Get AI Chat Data **/
	const getData = useMemoizedFn((message: App.ChatHuman) => {
		setLoading(true)
		const contentRaw = encodeURIComponent(message.text)
		const contextRaw = encodeURIComponent(JSON.stringify(message.context))
		const token = getToken()
		const endpoint = `${neo_api}?content=${contentRaw}&context=${contextRaw}&token=${token}&chat_id=${chat_id}`
		const es = new EventSource(endpoint)
		event_source.current = es
		es.onopen = () => messages.push({ is_neo: true, text: '' })
		es.onmessage = ({ data }: { data: string }) => {
			const formated_data = ntry(() => JSON.parse(data)) as App.ChatAI
			if (!formated_data) return

			const { text, confirm, actions, done, command } = formated_data
			const current_answer = messages[messages.length - 1] as App.ChatAI
			if (done) {
				current_answer.confirm = confirm
				current_answer.actions = actions
				setMessages([...messages])
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

	/** Cancel the AI Chat **/
	const cancel = useMemoizedFn(() => {
		setLoading(false)
		event_source.current?.close()
	})

	useAsyncEffect(async () => {
		if (!neo_api) return
		getHistory()
	}, [neo_api])

	/** Get AI Chat Data **/
	useEffect(() => {
		if (!messages.length) return

		const latest_message = messages.at(-1)!

		if (latest_message.is_neo) return

		getData(latest_message)
	}, [messages])

	/** Clean up the AI Chat **/
	useEffect(() => {
		return () => event_source.current?.close()
	}, [])

	return { messages, loading, setMessages, cancel }
}
