import { getToken } from '@/knife'
import { message as message_ } from 'antd'
import { getLocale } from '@umijs/max'
import to from 'await-to-js'
import ntry from 'nice-try'
import axios from 'axios'
import { App } from '@/types'
import { GenerateOptions } from './types'

export const createTitleGenerationHandlers = (
	neo_api: string | undefined,
	chat_id: string | undefined,
	assistant_id: string | undefined,
	setTitle: React.Dispatch<React.SetStateAction<string>>,
	setTitleGenerating: React.Dispatch<React.SetStateAction<boolean>>,
	updateChat: (chatId: string, title: string) => Promise<boolean>
) => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	/** Handle title generation with progress updates **/
	const handleTitleGeneration = async (messages: App.ChatInfo[], chatId: string) => {
		if (!chatId) return

		setTitleGenerating(true)

		try {
			let generatedTitle = ''

			await generateTitle(JSON.stringify(messages), {
				useSSE: true,
				onProgress: (title) => {
					setTitle(title)
					generatedTitle = title // Keep track of final title
				},
				onComplete: async (finalTitle) => {
					// Use the final complete title
					generatedTitle = finalTitle
					// Remove <think>....</think>
					finalTitle = finalTitle.replace(/<think>.*?<\/think>/g, '')
					const parts = finalTitle.split('</think>')
					if (parts.length > 1) {
						finalTitle = parts[1]
					}

					setTitle(finalTitle)

					// Update the chat with the generated title
					try {
						await updateChat(chatId, finalTitle)
					} catch (err) {
						console.error('Failed to update chat title:', err)
						message_.error(is_cn ? '更新标题失败' : 'Failed to update chat title')
					}
				}
			})
		} catch (err) {
			console.error('Failed to generate title:', err)
			message_.error(is_cn ? '生成标题失败' : 'Failed to generate title')
		} finally {
			setTitleGenerating(false)
		}
	}

	/** Generate title **/
	const generateTitle = async (content: string, options: GenerateOptions = {}) => {
		if (!neo_api) return ''

		const endpoint = `${neo_api}/generate/title?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}${
			assistant_id ? `&assistant_id=${assistant_id}` : ''
		}&content=${encodeURIComponent(content)}`

		if (options.useSSE) {
			return new Promise<string>((resolve, reject) => {
				const es = new EventSource(endpoint, { withCredentials: true })
				let result = ''

				es.onmessage = ({ data }) => {
					const response = ntry(() => JSON.parse(data))
					if (!response) return

					// Handle error response
					if (response.type === 'error') {
						es.close()
						reject(new Error(response.text))
						return
					}

					const { text, done } = response
					if (text) {
						result += text
						options.onProgress?.(result)
					}
					if (done) {
						es.close()
						options.onComplete?.(result)
						resolve(result)
					}
				}

				es.onerror = (err) => {
					es.close()
					reject(err)
				}
			})
		}

		// Regular HTTP request
		const [err, res] = await to(axios.post(endpoint, { content }))
		if (err) throw err
		return res?.data?.result || ''
	}

	/** Generate prompts **/
	const generatePrompts = async (content: string, options: GenerateOptions = {}) => {
		if (!neo_api) return ''

		const endpoint = `${neo_api}/generate/prompts?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}${
			assistant_id ? `&assistant_id=${assistant_id}` : ''
		}&content=${encodeURIComponent(content)}`

		if (options.useSSE) {
			return new Promise<string>((resolve, reject) => {
				const es = new EventSource(endpoint, { withCredentials: true })
				let result = ''

				es.onmessage = ({ data }) => {
					const response = ntry(() => JSON.parse(data))
					if (!response) return

					// Handle error response
					if (response.type === 'error') {
						es.close()
						reject(new Error(response.text))
						return
					}

					const { text, done } = response
					if (text) {
						result += text
						options.onProgress?.(result)
					}
					if (done) {
						options.onComplete?.(result)
						es.close()
						resolve(result)
					}
				}

				es.onerror = (err) => {
					es.close()
					reject(err)
				}
			})
		}

		// Regular HTTP request
		const [err, res] = await to(axios.post(endpoint, { content }))
		if (err) throw err
		return res?.data?.result || ''
	}

	/** Generate with AI **/
	const generate = async (content: string, type: string, systemPrompt: string, options: GenerateOptions = {}) => {
		if (!neo_api) return ''

		const endpoint = `${neo_api}/generate?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}${
			assistant_id ? `&assistant_id=${assistant_id}` : ''
		}`

		if (options.useSSE) {
			return new Promise<string>((resolve, reject) => {
				const es = new EventSource(endpoint, { withCredentials: true })
				let result = ''

				es.onmessage = ({ data }) => {
					const response = ntry(() => JSON.parse(data))
					if (!response) return

					// Handle error response
					if (response.type === 'error') {
						es.close()
						reject(new Error(response.text))
						return
					}

					const { text, done } = response
					if (text) {
						result += text
						options.onProgress?.(result)
					}
					if (done) {
						es.close()
						options.onComplete?.(result)
						resolve(result)
					}
				}

				es.onerror = (err) => {
					es.close()
					reject(err)
				}
			})
		}

		// Regular HTTP request
		const [err, res] = await to(axios.post(endpoint, { content, type, system_prompt: systemPrompt }))
		if (err) throw err
		return res?.data?.result || ''
	}

	return {
		handleTitleGeneration,
		generateTitle,
		generatePrompts,
		generate
	}
}
