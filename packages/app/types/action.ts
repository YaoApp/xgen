import { Global } from '@/types'

export declare namespace Action {
	interface OpenModal {
		Form?: {
			type: 'view' | 'edit'
			model: string
		}
		Page?: {
			type: 'chart'
			model: string
		}
	}

	interface Props {
		title: string
		icon: string
		action: {
			'Common.openModal'?: OpenModal
			'Common.historyPush'?: { pathname: string }
			'Common.historyBack'?: {}
			'Table.save'?: Global.StringObject
			'Table.delete'?: {}
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
