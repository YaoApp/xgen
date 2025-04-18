export * from './preset'
export * from './filter'
export * from './algorithm'
export * from './reg'
export * from './theme'
export * from './bind'
export { default as studio_request } from './studio_request'
export { default as retryUntil } from './retryUntil'

export const isValidUrl = (str: string): boolean => {
	try {
		const url = new URL(str)
		return url.protocol === 'http:' || url.protocol === 'https:'
	} catch {
		return false
	}
}

/**
 * Transform size to human readable format
 * @param size - size in bytes
 * @returns human readable size
 */
export const SizeHumanize = (size: number) => {
	if (size < 1024) {
		return `${size} B`
	}

	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(2)} KB`
	}

	if (size < 1024 * 1024 * 1024) {
		return `${(size / 1024 / 1024).toFixed(2)} MB`
	}

	if (size < 1024 * 1024 * 1024 * 1024) {
		return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
	}

	return `${(size / 1024 / 1024 / 1024 / 1024).toFixed(2)} TB`
}

/**
 * Format date time to human readable format
 * @param date - date
 * @param is_cn - whether to use chinese
 * @returns human readable date time
 */
export const FormatDateTime = (date: Date, is_cn?: boolean) => {
	const options = {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	} as const

	if (is_cn) {
		return `${date.getMonth() + 1}月${date.getDate()}日 ${date.toLocaleTimeString('zh-CN', options)}`
	}
	return `${date.toLocaleString('en-US', { month: 'short', day: 'numeric' })} ${date.toLocaleTimeString(
		'en-US',
		options
	)}`
}

/**
 * Escape HTML characters
 * @param html - html string
 * @returns escaped html string
 */
export const HtmlEscape = (html: string) => {
	return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
