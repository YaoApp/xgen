import { Global } from '@/types'

export declare namespace Action {
	interface OpenModal {
		width?: number | string
		byDrawer?: { mask?: boolean }
		Form?: {
			type: 'view' | 'edit'
			model: string
			id?: number | string
		}
		Page?: {
			type: 'chart'
			model: string
			id?: number | string
		}
	}

	interface HistoryPush {
		pathname: string
		search?: any
		public?: boolean
		refetch?: boolean
		withFilterQuery?: boolean
		withToken?: boolean | string
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

	interface ShowMessage {
		type: 'success' | 'warning' | 'error'
		content: string
	}

	type EmitEvent = { key: string; value: any } | EventToggleNeo | EventSetFieldsValue | EventUnLoadingAI
	type EventToggleNeo = {
		key: 'app/setNeoVisible'
		value: { visible: boolean; placeholder?: string; signal?: any }
	}
	type EventSetFieldsValue = {
		key: `$namespace/setFieldsValue`
		value: Record<string, any>
	}
	type EventUnLoadingAI = {
		key: `$namespace/$item.bind/unloading`
	}

	interface ActionMap {
		'Common.openModal': OpenModal
		'Common.closeModal': {}
		'Common.historyPush': HistoryPush
		'Common.historyBack': {}
		'Common.confirm': Confirm
		'Common.refetch': {}
		'Common.reload': Reload
		'Common.reloadMenu': {}
		'Common.showMessage': ShowMessage
		'Common.emitEvent': EmitEvent
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
