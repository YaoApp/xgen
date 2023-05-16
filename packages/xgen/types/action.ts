import { Global } from '@/types'

export declare namespace Action {
	interface OpenModal {
		width?: number | string
		byDrawer?: { mask?: boolean }
		Form?: {
			type: 'view' | 'edit'
			model: string
		}
		Page?: {
			type: 'chart'
			model: string
		}
	}

	interface HistoryPush {
		pathname: string
		search?: any
		public?: boolean
		refetch?: boolean
	}

	interface Confirm {
		title: string
		content: string
	}

	interface YaoParams {
		method: string
		args: Array<any>
	}

	interface Reload {
		neo?: boolean
	}

	interface ActionMap {
		'Common.openModal': OpenModal
		'Common.closeModal': {}
		'Common.historyPush': HistoryPush
		'Common.historyBack': {}
		'Common.confirm': Confirm
		'Common.refetch': {}
		'Common.reload': Reload
		'Table.search': {}
		'Table.save': Global.StringObject
		'Table.delete': {}
		'Form.find': {}
		'Form.submit': Global.StringObject
		'Form.delete': {}
		'Form.fullscreen': {}
		'Service.*': YaoParams
		'Studio.*': YaoParams
	}

	type ActionParams = {
		[T in keyof ActionMap]: {
			name: string
			type: T
			payload: ActionMap[T]
			next?: string
			error?: string
		}
	}[keyof ActionMap]

	interface Props {
		title: string
		icon: string
		action: Array<ActionParams>
		style?: 'danger' | 'success' | 'primary'
		divideLine?: boolean
		showWhenAdd?: boolean
		showWhenView?: boolean
		hideWhenEdit?: boolean
		disabled?: {
			bind: string
			value: string | Array<string>
		}
	}
}
