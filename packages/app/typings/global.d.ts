import type { GlobalModel } from '@/context/app'

declare global {
	interface Window {
		$global: GlobalModel
	}
}

export {}
