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

	interface FormDeleteParams {
		back?: boolean
		pathname?: string
	}

	interface YaoParams {
		method: string
		args: Array<any>
	}

	interface Props {
		title: string
		icon: string
		action: {
			'Common.openModal'?: OpenModal
			'Common.historyPush'?: HistoryPush
			'Common.historyBack'?: {}
			'Table.save'?: Global.StringObject
			'Table.delete'?: {}
			'Form.save'?: Global.StringObject
			'Form.delete'?: FormDeleteParams
			'Service.*'?: YaoParams
			'Studio.*'?: YaoParams
		}
		style?: 'danger' | 'success'
		disabled?: {
			bind: string
			value: string | Array<string>
		}
		confirm?: {
			title: string
			desc: string
		}
	}
}
