interface IConfigCommonOpenModal {
	Form?: {
		type: 'view' | 'edit'
		model: string
	}
	Page?: {
		type: 'chart'
		model: string
	}
}

interface IConfigCommonPushHistory {
	pathname: string
}

interface IConfigTableSave {
	[key: string]: any
}

export default interface Action {
	title: string
	icon: string
	action: {
		'Common.openModal'?: IConfigCommonOpenModal
		'Common.pushHistory'?: IConfigCommonPushHistory
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
	}
}
