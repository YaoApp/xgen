// Utility functions for AIChat

// HTML escape helper function
export const escapeHtml = (text: string) => {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}

// Process content between tags
export const processTagContent = (text: string, tagName: string) => {
	// Look for content between opening and closing tags, using positive lookbehind and lookahead
	const regex = new RegExp(`(?<=<${tagName}>)(.*?)(?=<\/${tagName}>)`, 'gis')
	return text.replace(regex, (content) => {
		return escapeHtml(content)
	})
}

/** Format text to MDX with proper tag handling */
export const formatToMDX = (props: Record<string, any>, text: string, tokens: Record<string, { pending: boolean }>) => {
	let formattedText = text
	Object.keys(tokens).forEach((token) => {
		const tag = token.charAt(0).toUpperCase() + token.slice(1)
		const pending = tokens[token]?.pending ? 'true' : 'false'

		// First escape content inside the original tags
		formattedText = processTagContent(formattedText, token)

		// TrimRight uncompleted tags
		formattedText = formattedText.replace(/<[^>]*$/, '')

		let formattedProps = ''
		if (props) {
			for (const key in props) {
				if (key == 'text') continue
				let value = null
				if (typeof props[key] === 'string') {
					value = props[key]
				} else if (typeof props[key] === 'boolean') {
					value = props[key] ? 'true' : 'false'
				} else if (typeof props[key] === 'number') {
					value = props[key].toString()
				}
				formattedProps += `${key}="${value}" `
			}
		}

		// Then replace the tags with the new format
		formattedText = formattedText
			.replace(new RegExp(`<${token}>`, 'gi'), `<${tag} pending="${pending}" ${formattedProps}>\n`)
			.replace(new RegExp(`</${token}>`, 'gi'), `\n</${tag}>`)
	})

	return formattedText
}

export const formatFileName = (fileName: string, maxLength: number = 30) => {
	if (fileName.length <= maxLength) return fileName

	const ext = fileName.split('.').pop() || ''
	const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'))
	const start = nameWithoutExt.slice(0, 10)
	const end = nameWithoutExt.slice(-10)

	return `${start}...${end}.${ext}`
}

// Generate a unique chat ID
export const makeChatID = () => {
	const random = Math.random().toString(36).substring(2, 15)
	const ts = Date.now()
	return `chat_${ts}_${random}`
}
