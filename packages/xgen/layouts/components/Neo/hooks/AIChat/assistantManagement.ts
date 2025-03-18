import { getToken } from '@/knife'
import axios from 'axios'
import to from 'await-to-js'
import { App } from '@/types'
import { useMemoizedFn } from 'ahooks'
const defaultSelectFields = [
	'assistant_id',
	'automated',
	'avatar',
	'connector',
	'description',
	'mentionable',
	'placeholder',
	'name',
	'readonly',
	'sort',
	'tags',
	'type'
]

export const createAssistantManagement = (
	neo_api: string | undefined,
	chat_id: string | undefined,
	setAssistant: React.Dispatch<React.SetStateAction<App.AssistantSummary | undefined>>,
	setAssistantId: React.Dispatch<React.SetStateAction<string | undefined>>,
	default_assistant: App.AssistantSummary
) => {
	/** Update assistant **/
	const updateAssistant = async (assistant: App.AssistantSummary) => {
		setAssistant(assistant)
		setAssistantId(assistant.assistant_id)
	}

	/** Reset assistant **/
	const resetAssistant = () => {
		updateAssistant(default_assistant)
	}

	/** Get Assistant List */
	const getAssistants = async (filter?: App.AssistantFilter) => {
		if (!neo_api) return { data: [], page: 1, pagesize: 10, total: 0, last_page: 1 }

		const params = new URLSearchParams()
		params.append('token', getToken())

		// Default filter values
		filter = filter || {}
		filter.select = filter.select || defaultSelectFields

		if (filter.select) params.append('select', filter.select.join(','))
		if (filter.keywords) params.append('keywords', filter.keywords)
		if (filter.page) params.append('page', filter.page.toString())
		if (filter.pagesize) params.append('pagesize', filter.pagesize.toString())
		if (filter.tags) params.append('tags', filter.tags.join(','))
		if (filter.connector) params.append('connector', filter.connector)
		if (filter.mentionable !== undefined) params.append('mentionable', filter.mentionable.toString())
		if (filter.automated !== undefined) params.append('automated', filter.automated.toString())

		const endpoint = `${neo_api}/assistants?${params.toString()}`
		const [err, res] = await to<{ data: App.AssistantResponse }>(axios.get(endpoint))
		if (err) throw err

		return res?.data || { data: [], page: 1, pagesize: 10, total: 0, last_page: 1 }
	}

	/** Get Assistant Tags */
	const getAssistantTags = async () => {
		if (!neo_api) return []

		const endpoint = `${neo_api}/assistants/tags?token=${encodeURIComponent(getToken())}`
		const [err, res] = await to<{ data: { data: string[] } }>(axios.get(endpoint))
		if (err) throw err

		return res?.data || []
	}

	/** Call Assistant API */
	const callAssistantAPI = async (assistantId: string, name: string, payload: Record<string, any>) => {
		if (!neo_api) return null
		const endpoint = `${neo_api}/assistants/${assistantId}/call?token=${encodeURIComponent(getToken())}`
		const [err, res] = await to<{ data: any }>(axios.post(endpoint, { name, payload }))
		if (err) throw err

		return res || null
	}

	/** Find Assistant Detail */
	const findAssistant = async (assistantId: string) => {
		if (!neo_api) return null

		const endpoint = `${neo_api}/assistants/${assistantId}?token=${encodeURIComponent(getToken())}`
		const [err, res] = await to<{ data: App.Assistant }>(axios.get(endpoint))
		if (err) throw err

		return res?.data || null
	}

	/** Save Assistant */
	const saveAssistant = async (assistant: Partial<App.Assistant>) => {
		if (!neo_api) return null

		const endpoint = `${neo_api}/assistants?token=${encodeURIComponent(getToken())}`
		const [err, res] = await to<{ data: App.Assistant }>(axios.post(endpoint, assistant))
		if (err) throw err

		return res?.data || null
	}

	/** Delete Assistant */
	const deleteAssistant = async (assistantId: string) => {
		if (!neo_api) return false

		const endpoint = `${neo_api}/assistants/${assistantId}?token=${encodeURIComponent(getToken())}`
		const [err] = await to(axios.delete(endpoint))
		if (err) throw err

		return true
	}

	return {
		updateAssistant,
		resetAssistant,
		getAssistants,
		getAssistantTags,
		callAssistantAPI,
		findAssistant,
		saveAssistant,
		deleteAssistant
	}
}
