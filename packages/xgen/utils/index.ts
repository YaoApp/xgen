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
