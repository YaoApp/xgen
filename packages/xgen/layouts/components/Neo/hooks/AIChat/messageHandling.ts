import { App, Action } from '@/types'
import { formatToMDX } from './utils'

/**
 * Merge messages with the same ID into consolidated messages
 * @param parsedContent Array of message content objects to be merged
 * @param baseMessage Base message properties to apply to all merged messages
 * @returns Array of consolidated chat messages
 */
export const mergeMessages = (parsedContent: any[], baseMessage: any): App.ChatInfo[] => {
	const res: App.ChatInfo[] = []

	// Step 1: Group messages by ID
	const messageGroups = new Map<string, any[]>()
	parsedContent.forEach((item) => {
		if (!item.id) {
			let text = item.type === 'think' || item.type === 'tool' ? item.props?.['text'] : item.text || ''

			res.push({
				...baseMessage,
				...item,
				type: 'text',
				text: text
			})
			return
		}
		const group = messageGroups.get(item.id) || []
		group.push(item)
		messageGroups.set(item.id, group)
	})

	// Step 2 & 3: Process each group and merge into the last item
	messageGroups.forEach((group) => {
		const lastItem = group[group.length - 1]
		let mergedText = ''

		// Merge all items' text
		group.forEach((item) => {
			if (item.type === 'think' || item.type === 'tool') {
				let text = item.props?.['text'] || ''
				mergedText += '\n' + text
			} else {
				mergedText += '\n' + item.text || ''
			}
		})

		// If message type is not text, tool, think, then append directly
		if (lastItem.type != 'text' && lastItem.type != 'tool' && lastItem.type != 'think') {
			res.push({ ...baseMessage, ...lastItem })
			return
		}

		// Create final message based on last item's type
		const finalMessage = {
			...baseMessage,
			...lastItem,
			type: 'text',
			text: formatToMDX(mergedText, {
				think: { pending: false },
				tool: { pending: false }
			})
		}

		// Remove props if exists
		if (finalMessage.props) {
			delete finalMessage.props
		}

		res.push(finalMessage)
	})
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
 * Interface for parameters needed to process AI chat data
 */
export interface ProcessAIChatDataParams {
	// Raw data and content
	/** Raw data string from event source */
	data: string
	/** Current accumulated content */
	content: string

	// Messages and assistant information
	/** Array of chat messages */
	messages: Array<App.ChatInfo>
	/** Object to track assistant information */
	last_assistant: {
		assistant_id: string | null
		assistant_name: string | null
		assistant_avatar: string | null
	}

	// State update functions
	/** Function to update assistant information */
	updateAssistant: (assistant: App.AssistantSummary) => void
	/** Function to update messages state */
	setMessages: (messages: Array<App.ChatInfo>) => void
	/** Function to update loading state */
	setLoading: (loading: boolean) => void

	// Event source and handlers
	/** EventSource instance for SSE connection */
	eventSource: EventSource
	/** Function to handle title generation */
	handleTitleGeneration: (messages: Array<App.ChatInfo>, chat_id: string) => void

	// Configuration
	/** Current chat ID */
	chat_id: string | undefined
	/** Default assistant ID */
	defaultAssistantId: string | undefined

	// Action handling
	/** Action dispatcher function */
	onAction: (params: {
		namespace: string
		primary: string
		data_item: any
		it: { action: Array<Action.ActionParams>; title: string; icon: string }
		extra?: any
	}) => void
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
		data,
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

	// Parse data from event source
	const formated_data = JSON.parse(data) as App.ChatAI
	if (!formated_data) return content

	// Extract data properties from the parsed message
	const {
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

		// Generate title for the first message if needed
		if (isFirstMessage(messages) && chat_id) {
			handleTitleGeneration(messages, chat_id)
		}

		// Update messages state if there's text or props
		if ((text && text.length > 0) || props) {
			setMessages([...messages])
		}
		setLoading(false)
		eventSource.close()
		return updatedContent
	}

	// Skip processing if no content to update
	if (!text && !props && !type) return updatedContent

	// Update props if available
	if (props) {
		current_answer.props = props
	}

	// Handle text content processing
	const tokens: Record<string, { pending: boolean }> = {
		think: { pending: false },
		tool: { pending: false }
	}
	if (text) {
		current_answer.text = updatedContent

		// Handle delta (incremental) message updates
		if (delta) {
			current_answer.text = updatedContent
			if (type == 'think' || type == 'tool') {
				current_answer.type = 'text'
				// Check if the tag is closed, add closing tag if needed
				if (updatedContent.indexOf(`</${type}>`) == -1) {
					tokens[type].pending = true
					current_answer.text += `</${type}>`
				}
			}
		}

		// Format the text to be valid MDX with proper tag handling
		current_answer.text = formatToMDX(current_answer.text, tokens)
	}

	// Update the messages state with the modified current answer
	const message_new = [...messages]
	if (message_new.length > 0) {
		message_new[message_new.length - 1] = { ...current_answer }
		setMessages(message_new)
	}

	return updatedContent
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
