export interface IConfigCommonOpenModal {
	Form?: {
		type: 'view' | 'edit'
		model: string
	}
	Page?: {
		type: 'chart'
		model: string
	}
}

interface IConfigCommonHistoryPush {
	pathname: string
}

interface IConfigTableSave {
	[key: string]: string
}

export default interface Action {
	title: string
	icon: string
	action: {
		'Common.openModal'?: IConfigCommonOpenModal
		'Common.historyPush'?: IConfigCommonHistoryPush
		'Common.historyBack'?: {}
		'Table.save'?: IConfigTableSave
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
