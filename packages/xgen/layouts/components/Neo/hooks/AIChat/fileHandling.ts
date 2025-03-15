import { getToken } from '@/knife'
import { message as message_ } from 'antd'
import { RcFile } from 'antd/es/upload'
import to from 'await-to-js'
import { App } from '@/types'

// Update allowed file types - only keep specific document types
export const ALLOWED_FILE_TYPES = {
	'application/json': 'json',
	'application/pdf': 'pdf',
	'application/msword': 'doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
	'application/vnd.oasis.opendocument.text': 'odt',
	'application/vnd.ms-excel': 'xls',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
	'application/vnd.ms-powerpoint': 'ppt',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
} as const

// Keep CODE_FILE_TYPES for handling specific code file extensions
export const CODE_FILE_TYPES: Record<string, string> = {
	'.js': 'text/javascript',
	'.ts': 'text/typescript',
	'.go': 'text/x-go',
	'.py': 'text/x-python',
	'.java': 'text/x-java',
	'.c': 'text/x-c',
	'.cpp': 'text/x-c++',
	'.rb': 'text/x-ruby',
	'.php': 'text/x-php',
	'.swift': 'text/x-swift',
	'.rs': 'text/x-rust',
	'.jsx': 'text/javascript',
	'.tsx': 'text/typescript',
	'.vue': 'text/x-vue',
	'.sh': 'text/x-sh',
	'.yao': 'text/x-yao',
	'.mdx': 'text/markdown',
	'.yml': 'text/x-yaml',
	'.yaml': 'text/x-yaml'
}

export const createFileHandlers = (
	neo_api: string | undefined,
	chat_id: string | undefined,
	assistant_id: string | undefined,
	uploadControllers: React.MutableRefObject<Map<string, AbortController>>,
	upload_options: Record<string, any> = {}
) => {
	/** Upload files to Neo API **/
	const uploadFile = async (file: RcFile, handleVision: boolean = true) => {
		const controller = new AbortController()
		uploadControllers.current.set(file.name, controller)

		if (!neo_api) {
			throw new Error('Neo API endpoint not configured')
		}

		// Default options
		const options = {
			process_image: false,
			vision: handleVision,
			max_file_size: 10, // 10MB
			allowed_types: ['image/*', '.pdf', '.doc', '.docx', '.txt'],
			...upload_options
		}

		// Validate file size
		const maxSize = options.max_file_size * 1024 * 1024 // Convert to bytes
		if (file.size > maxSize) {
			throw new Error(`File size cannot exceed ${options.max_file_size}MB`)
		}

		// Update isValidType to use CODE_FILE_TYPES
		const isValidType = (fileType: string, fileName: string) => {
			// Check for code file extensions
			const codeExtensions = Object.keys(CODE_FILE_TYPES)
			if (codeExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))) {
				return true
			}

			// Check for general media types
			if (
				fileType.startsWith('text/') ||
				fileType.startsWith('image/') ||
				fileType.startsWith('audio/') ||
				fileType.startsWith('video/')
			) {
				return true
			}

			// Check for specific document types
			return fileType in ALLOWED_FILE_TYPES
		}

		if (!isValidType(file.type, file.name)) {
			throw new Error('File type not supported')
		}

		const formData = new FormData()

		// Handle code files with correct Content-Type
		const ext = '.' + file.name.split('.').pop()?.toLowerCase()
		if (ext && CODE_FILE_TYPES[ext]) {
			const codeBlob = new Blob([file], { type: CODE_FILE_TYPES[ext] })
			formData.append('file', codeBlob, file.name)
		} else {
			formData.append('file', file)
		}

		for (const [key, value] of Object.entries(options)) {
			formData.append(`option_${key}`, String(value))
		}

		const endpoint = `${neo_api}/upload?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}${
			assistant_id ? `&assistant_id=${assistant_id}` : ''
		}`

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData,
				credentials: 'include',
				signal: controller.signal
			})

			uploadControllers.current.delete(file.name)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || `HTTP error! status: ${response.status}`)
			}

			const result = await response.json()
			return {
				url: result.filename,
				...result,
				content_type: result.content_type || file.type,
				chat_id: chat_id,
				assistant_id: assistant_id
			}
		} catch (error: any) {
			uploadControllers.current.delete(file.name)
			if (error.name === 'AbortError') {
				throw new Error('Upload cancelled')
			}
			message_.error(error.message || 'Failed to upload file')
			throw error
		}
	}

	/** Download file from Neo API **/
	const downloadFile = async (file_id: string, disposition: 'inline' | 'attachment' = 'attachment') => {
		if (!neo_api) {
			throw new Error('Neo API endpoint not configured')
		}

		if (!chat_id) {
			throw new Error('Chat ID is required')
		}

		const endpoint = `${neo_api}/download?file_id=${encodeURIComponent(file_id)}&token=${encodeURIComponent(
			getToken()
		)}&chat_id=${chat_id}&disposition=${disposition}${assistant_id ? `&assistant_id=${assistant_id}` : ''}`

		try {
			const response = await fetch(endpoint, {
				credentials: 'include'
			})

			if (!response.ok) {
				const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }))
				throw new Error(error.message || `Failed to download file: ${response.statusText}`)
			}

			// Get filename from Content-Disposition header if present
			const contentDisposition = response.headers.get('Content-Disposition')
			const filename = contentDisposition
				? contentDisposition.split('filename=')[1]?.replace(/["']/g, '')
				: file_id

			// Create blob from response
			const blob = await response.blob()

			// Create download link and trigger download
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = filename
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)

			return { success: true }
		} catch (error: any) {
			message_.error(error.message || 'Failed to download file')
			throw error
		}
	}

	/** Cancel upload **/
	const cancelUpload = (fileName: string) => {
		const controller = uploadControllers.current.get(fileName)
		if (controller) {
			controller.abort()
			uploadControllers.current.delete(fileName)
		}
	}

	return {
		uploadFile,
		downloadFile,
		cancelUpload
	}
}
