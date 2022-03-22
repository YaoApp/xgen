interface CheckBox {
	value: ':status'
	visible_label: false
	status: Array<{ label: string; value: string }>
}

interface Item {
	title: string
	icon: string
	props: {
		type: string
		useModal: boolean
		formName: string
		formId: string
	}
}

export default interface Actions {
	checkbox: Array<CheckBox>
	items: Array<Item>
}
