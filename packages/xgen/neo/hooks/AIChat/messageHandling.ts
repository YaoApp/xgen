import { App, Action } from '@/types'
import { formatToMDX } from './utils'
import { MergePropsParams, MessageLog, ProcessAIChatDataParams } from './types'

/**
 * Merge messages with the same ID into consolidated messages
 * @param parsedContent Array of message content objects to be merged
 * @param baseMessage Base message properties to apply to all merged messages
 * @returns Array of consolidated chat messages
 */
export const mergeMessages = (parsedContent: any[], baseMessage: any): App.ChatInfo[] => {
	const res: App.ChatInfo[] = []
	const processedIds = new Map<string, number>() // Track which IDs we've seen and their position

	// Process messages in original order
	parsedContent.forEach((item, index) => {
		item.done = true
		if (!item.id) {
			// For items without ID, add them directly
			let text = ''
			if (item.type === 'think' || item.type === 'tool') {
				text = (item as any).props?.['text'] || ''
				res.push({
					...baseMessage,
					...item,
					type: 'text',
					text
				})
			} else {
				// For non-text types, preserve the original type and props
				res.push({
					...baseMessage,
					...item
				})
			}
			return
		}

		// If we've seen this ID before, merge with the previous message
		if (processedIds.has(item.id)) {
			const prevIndex = processedIds.get(item.id)!
			const prevMessage = res[prevIndex] as any

			// Merge text content
			let newText = ''
			if (item.type === 'think' || item.type === 'tool') {
				newText = (item as any).props?.['text'] || ''
				const tool_id = item.props?.id || item.tool_id || ''
				const begin = item.props?.begin || item.begin || 0
				const end = item.props?.end || item.end || 0
				const props = { ...(item.props || {}), id: tool_id, begin, end }
				prevMessage.text = formatToMDX(props, prevMessage.text + '\n' + newText, {
					think: { pending: false },
					tool: { pending: false }
				})

				// Update properties while keeping text type
				Object.assign(prevMessage, {
					...item,
					type: 'text',
					text: prevMessage.text
				})

				// Remove props for text type messages
				if ('props' in prevMessage) {
					delete prevMessage.props
				}
			} else {
				// For non-text types, update with the latest properties
				Object.assign(prevMessage, {
					...item
				})
			}
		} else {
			// First time seeing this ID
			if (item.type === 'think' || item.type === 'tool') {
				let text = (item as any).props?.['text'] || ''
				const tool_id = item.props?.id || item.tool_id || ''
				const begin = item.props?.begin || item.begin || 0
				const end = item.props?.end || item.end || 0
				const props = { ...(item.props || {}), id: tool_id, begin, end }
				const newMessage = {
					...baseMessage,
					...item,
					type: 'text',
					text: formatToMDX(props, text, {
						think: { pending: false },
						tool: { pending: false }
					})
				}

				// Remove props for text type messages
				if ('props' in newMessage) {
					delete (newMessage as any).props
				}

				res.push(newMessage)
			} else {
				// For non-text types, preserve the original type and props
				res.push({
					...baseMessage,
					...item
				})
			}
			processedIds.set(item.id, res.length - 1)
		}
	})

	// Set previous_assistant_id for each message
	for (let i = 1; i < res.length; i++) {
		if (!res[i].is_neo) continue
		const current = res[i] as App.ChatAI
		const previous = res[i - 1] as App.ChatAI
		if (previous.is_neo && previous.assistant_id) {
			current.previous_assistant_id = previous.assistant_id
		}
	}

	return res
}

/**
 * Format chat message based on role and content
 * @param role The role of the message sender (e.g., 'assistant')
 * @param content The message content (text or JSON)
 * @param chatId The ID of the chat
 * @param assistant_id Optional assistant ID
 * @param assistant_name Optional assistant name
 * @param assistant_avatar Optional assistant avatar URL
 * @returns Formatted chat message(s)
 */
export const formatMessage = (
	role: string,
	content: string,
	chatId: string,
	assistant_id?: string,
	assistant_name?: string,
	assistant_avatar?: string
) => {
	const baseMessage = {
		is_neo: role === 'assistant',
		context: { chat_id: chatId, assistant_id },
		assistant_id,
		assistant_name,
		assistant_avatar
	}

	// Check if content is potentially JSON
	const trimmedContent = content.trim()

	// Check if content is potentially JSON Array
	if (trimmedContent.startsWith('[{')) {
		try {
			const parsedContent = JSON.parse(trimmedContent)
			return mergeMessages(parsedContent, baseMessage)
		} catch (e) {
			return [{ ...baseMessage, text: content }]
		}

		// Check if content is potentially JSON Object
	} else if (trimmedContent.startsWith('{')) {
		try {
			const parsedContent = JSON.parse(trimmedContent)
			return [{ ...baseMessage, ...parsedContent }]
		} catch (e) {
			return [{ ...baseMessage, text: content }]
		}
	}

	return [{ ...baseMessage, text: content }]
}

/**
 * Process and update content based on message type and delta status
 * @param content Current accumulated content
 * @param type Message type
 * @param text New text to add
 * @param delta Whether this is a delta (incremental) update
 * @param is_new Whether this is a new message
 * @param props Additional properties
 * @returns Updated content string
 */
export const getContent = (
	content: string,
	type: string,
	text: string,
	delta: boolean,
	is_new: boolean,
	props: Record<string, any> | undefined
): string => {
	// Content value
	if (delta) {
		content = content + text
		if (text?.startsWith('\r') || is_new) {
			content = text.replace('\r', '')
		}
		return content
	}
	return text || ''
}

/**
 * Process AI chat data from event source
 * This function handles the core logic for processing streaming AI responses,
 * including handling actions, updating messages, and managing assistant information.
 *
 * @param params Object containing all parameters needed for processing
 * @returns Updated content string
 */
export const processAIChatData = (params: ProcessAIChatDataParams): string => {
	const {
		formated_data,
		content,
		messages,
		last_assistant,
		updateAssistant,
		setMessages,
		setLoading,
		eventSource,
		handleTitleGeneration,
		chat_id,
		defaultAssistantId,
		onAction
	} = params

	// Internal function to run actions
	const runAction = (
		action: Array<Action.ActionParams>,
		namespace: string,
		primary: string,
		data_item: any,
		extra?: any
	) => {
		try {
			onAction({ namespace, primary, data_item, it: { action, title: '', icon: '' }, extra })
		} catch (err) {
			console.error('Failed to run action:', err)
		}
	}

	// Extract data properties from the parsed message
	const {
		tool_id,
		begin,
		end,
		text,
		props,
		type,
		done,
		assistant_id,
		assistant_name,
		assistant_avatar,
		new: is_new,
		delta
	} = formated_data

	// Update content based on message properties
	let updatedContent = getContent(content, type || 'text', text, delta || false, is_new, props)

	// Handle action message (special message type for executing actions)
	if (type === 'action') {
		const { namespace, primary, data_item, action, extra } = props || {}
		if (!action) {
			console.error('No actions found')
			if (done) {
				setLoading(false)
				eventSource.close()
			}
			return updatedContent
		}

		if (!Array.isArray(action)) {
			console.error('Action is not an array')
			if (done) {
				setLoading(false)
				eventSource.close()
			}
			return updatedContent
		}

		// Execute the action with provided parameters
		runAction(
			action as Array<Action.ActionParams>,
			namespace || 'chat',
			primary || 'id',
			data_item || {},
			extra
		)

		// Close event source if done flag is set
		if (done) {
			setLoading(false)
			eventSource.close()

			// Generate title for the first message if needed
			if (isFirstMessage(messages) && chat_id) {
				handleTitleGeneration(messages, chat_id)
			}
		}
		return updatedContent
	}

	// Create new message if is_new flag is set
	if (is_new) {
		// Mark the last message as done
		if (messages.length > 0 && (messages[messages.length - 1] as App.ChatInfo).is_neo) {
			messages[messages.length - 1] = { ...messages[messages.length - 1], done: true }
		}

		// Create new message
		messages.push({ ...formated_data, is_neo: true })
	}

	// Update assistant information from the message
	const current_answer = messages[messages.length - 1] as App.ChatAI
	if (assistant_id) {
		last_assistant.assistant_id = assistant_id
	}
	if (assistant_name) {
		last_assistant.assistant_name = assistant_name
	}
	if (assistant_avatar) {
		last_assistant.assistant_avatar = assistant_avatar
	}

	// Update current answer with assistant information
	if (is_new) current_answer.new = is_new
	current_answer.assistant_id = last_assistant.assistant_id || undefined
	current_answer.assistant_name = last_assistant.assistant_name || undefined
	current_answer.assistant_avatar = last_assistant.assistant_avatar || undefined
	current_answer.type = type || current_answer.type || 'text'

	// Set previous assistant id
	if (messages.length > 2) {
		// Get previous message
		const previous_message = messages[messages.length - 2] as App.ChatAI
		if (previous_message.assistant_id) {
			current_answer.previous_assistant_id = previous_message.assistant_id
		}
	}

	// Update tool ID
	if (tool_id) {
		current_answer.tool_id = tool_id
	}

	// Update assistant information in the global state if all required fields are present
	if (last_assistant.assistant_id && last_assistant.assistant_name && last_assistant.assistant_avatar) {
		updateAssistant({
			...last_assistant,
			assistant_deleteable: last_assistant.assistant_id !== defaultAssistantId
		} as App.AssistantSummary)
	}

	// Handle message completion (done flag is set)
	if (done) {
		if (text) {
			current_answer.text = text
		}
		if (type) {
			current_answer.type = type
		}

		if (props) {
			current_answer.props = props
		}

		// Check previous messages if is neo not mark as done, when done == true break
		const fix_done = fixMessageDone(messages, 'done')
		// Generate title for the first message if needed
		if (isFirstMessage(messages) && chat_id) {
			handleTitleGeneration(messages, chat_id)
		}

		// Update messages state if there's text or props or fix_done
		if ((text && text.length > 0) || props || fix_done) {
			setMessages([...messages])
		}
		setLoading(false)
		eventSource.close()
		return updatedContent
	}

	// Skip processing if no content to update
	if (!text && !props && !type) return updatedContent

	// Update props if available
	props && mergeProps(current_answer, props, { type, delta, begin, end })

	// Handle text content processing
	const tokens: Record<string, { pending: boolean }> = {
		think: { pending: false },
		tool: { pending: false }
	}
	if (text) {
		const tool_id = current_answer.tool_id || ''
		current_answer.text = updatedContent

		// Handle delta (incremental) message updates
		if (delta) {
			current_answer.text = updatedContent
			if (type == 'think' || type == 'tool') {
				current_answer.type = 'text'
				current_answer.props = { ...(current_answer.props || {}), id: tool_id, begin, end }
				// Check if the tag is closed, add closing tag if needed
				if (updatedContent.indexOf(`</${type}>`) == -1) {
					tokens[type].pending = true
					current_answer.text += `</${type}>`
				}
			}
		}

		// Format the text to be valid MDX with proper tag handling
		const props = { ...(current_answer.props || {}), id: tool_id, begin, end }
		current_answer.text = formatToMDX(props, current_answer.text, tokens)
	}

	// Update the messages state with the modified current answer
	const message_new = [...messages]
	if (message_new.length > 0) {
		message_new[message_new.length - 1] = { ...current_answer }
		setMessages(message_new)
	}

	return updatedContent
}

export const fixMessageDone = (messages: App.ChatInfo[], reason: 'cancelled' | 'error' | 'done'): boolean => {
	let fixed = false
	for (let i = messages?.length - 1; i >= 0; i--) {
		const message = messages[i]
		if (message.is_neo) {
			if ((message as App.ChatAI).done) {
				break
			}

			// If the message is plan, update each task status to failed
			if ((message as App.ChatAI).type == 'plan' && reason != 'done') {
				const default_status = reason == 'cancelled' ? 'cancelled' : 'failed'
				const tasks = (message as App.ChatAI).props?.tasks || []
				tasks.forEach((task: any) => {
					task.status = task.status != 'completed' ? default_status : task.status
				})
			}

			messages[i] = { ...message, done: true }
			fixed = true
		}
	}
	return fixed
}

/**
 * Check if this is the first message in the conversation
 * This is used to determine when to generate a title for the chat
 *
 * @param messages Array of chat messages
 * @returns Boolean indicating if this is the first message exchange
 */
export const isFirstMessage = (messages: App.ChatInfo[]) => {
	// Need at least two messages (user query and assistant response)
	if (messages.length < 2) return false

	// The first message should be a user message
	// The second message should be an assistant message
	const userMessage = messages[0]
	const assistantMessage = messages[1]
	const lastMessage = messages[messages.length - 1]

	// For exactly two messages
	if (messages.length === 2) {
		// Validate the last message is not an error message
		if (lastMessage.is_neo && (lastMessage as App.ChatAI).type == 'error') {
			return false
		}

		return userMessage && assistantMessage
	}

	// For more than two messages, check if there are any additional user messages
	// If there are, this is not the first message exchange
	let resetUserMessageCount = 0
	for (let i = 2; i < messages.length; i++) {
		const message = messages[i]
		if (!message.is_neo) {
			resetUserMessageCount++
		}

		if (resetUserMessageCount > 0) {
			return false
		}
	}

	// Validate the last message is not an error message
	if (lastMessage.is_neo && (lastMessage as App.ChatAI).type == 'error') {
		return false
	}

	return true
}

/**
 * Merge props with current answer
 * @param current_answer Current answer
 * @param props Props to merge
 * @param params Parameters for merging
 */
export const mergeProps = (current_answer: App.ChatAI, props: Record<string, any>, params: MergePropsParams) => {
	const { type, delta, begin: begin_param, end: end_param } = params
	let { begin, end, status } = current_answer.props || {}

	// Default begin and end
	begin = begin || begin_param
	end = end || end_param

	// Merge plan props
	if (type == 'plan') {
		mergePlanProps(current_answer, props, params)
		return
	}

	// Merge props
	if (type != 'text' && type != 'error' && props.id && delta) {
		current_answer.type = type
		const current_props = current_answer.props || {}
		let break_line = false

		// Merge title
		let title = current_answer.props?.title || ''
		if (props.title) {
			break_line = props.title.startsWith('\r')
			title = props.title.replace('\r', '')
		}

		// Merge text
		let text = current_answer.props?.text || ''
		if (props.text) {
			text = text + props.text
		}

		// Merge logs
		const logs: MessageLog[] = current_props.logs || [{ title, text, begin, end, status }]

		// New Log title with \r
		if (break_line) {
			// Update last log end
			if (logs[logs.length - 1]) {
				logs[logs.length - 1].end = begin
				logs[logs.length - 1].status = 'done'
			}

			text = props.text || ''
			logs.push({ title, text, begin, end })
		} else {
			logs[logs.length - 1] = { title, text, begin, end }
		}

		// Other props
		const new_props = { ...current_props, ...props, text, title, logs }
		current_answer.props = new_props
	} else {
		// No need to merge
		const title = current_answer.props?.title || ''
		const text = current_answer.props?.text || ''
		const logs: MessageLog[] = current_answer.props?.logs || [{ title, text, begin, end, status }]
		current_answer.props = { ...props, text, title, logs }
	}
}

/**
 * Merge plan props
 * @param current_answer Current answer
 * @param props Props to merge
 * @param params Parameters for merging
 */
function mergePlanProps(current_answer: App.ChatAI, props: Record<string, any>, params: MergePropsParams) {
	const begin = current_answer.props?.begin || params.begin
	const end = current_answer.props?.end || params.end
	// No need to merge
	if (!params.delta) {
		const title = current_answer.props?.title || ''
		const text = current_answer.props?.text || ''
		const status = planCompleted(props) ? 'completed' : 'running'
		const logs: MessageLog[] = current_answer.props?.logs || defaultPlanLogs(props, begin, end, status)
		current_answer.props = { ...props, text, title, logs }
		return
	}

	// Merge plan props
	const current_props = current_answer.props || {}
	const status = planCompleted(props) ? 'completed' : 'running'
	const tasks = current_props.tasks || []
	const logs: MessageLog[] = current_props.logs || defaultPlanLogs(props, begin, end, status)

	// Merge task props by task_id
	if (props.task_id && tasks.length > 0) {
		const task_props = tasks.find((task: any) => task.id == props.task_id)
		const task_log = logs.find((log: any) => log.task_id == props.task_id)
		const task_text =
			task_props?.text && task_props?.text.length > 0
				? task_props?.text + (props.text || '')
				: props.text || ''

		// Update status and details
		if (task_props) {
			props.status && (task_props.status = props.status) // update status
			props.text && props.text.length > 0 && (task_props.text = task_text)
		}

		// Update log
		if (task_log) {
			task_log.status = task_props.status == 'completed' ? 'done' : 'running'
			props.text && props.text.length > 0 && (task_log.text = task_text)
		}
	}

	// Update props
	const new_props = { ...current_props, ...props, logs: [...logs] }
	current_answer.props = new_props
}

function planCompleted(props: Record<string, any>): boolean {
	const tasks = props.tasks || []
	let completed = true
	tasks.forEach((task: any) => {
		if (task.status != 'completed' && task.status != 'failed') {
			completed = false
		}
	})
	return completed
}

function defaultPlanLogs(props: Record<string, any>, begin: number, end: number, status: string): MessageLog[] {
	const tasks = props.tasks || []
	return tasks.map((task: any) => ({
		title: task.title,
		text: task.text || '',
		begin: begin,
		end: end,
		status: task.status || status,
		task_id: task.id
	}))
}
