export default interface Action {
	title: string
	icon: string
	type: 'view' | 'edit'
	how: 'page' | 'model'
	props: {
		model: string
		bind: string
		danger?: boolean
		disabled?: boolean
	}
}
