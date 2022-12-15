import { Global } from '@/types'

export declare namespace Action {
	interface OpenModal {
		width?: number
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
	}

	interface Confirm {
		title: string
		content: string
	}

	interface YaoParams {
		method: string
		args: Array<any>
	}

	interface ActionMap {
		'Common.openModal': OpenModal
		'Common.closeModal': {}
		'Common.historyPush': HistoryPush
		'Common.historyBack': {}
		'Common.confirm': Confirm
		'Table.search': {}
		'Table.save': Global.StringObject
		'Table.delete': {}
		'Form.find': {}
		'Form.save': Global.StringObject
		'Form.delete': {}
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
		style?: 'danger' | 'success'
		divideLine?: boolean
		showWhenAddAndView?: boolean
		disabled?: {
			bind: string
			value: string | Array<string>
		}
	}
}
