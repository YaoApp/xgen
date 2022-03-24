export default interface Action {
	title: string
	icon: string
	props: {
		type: string
		useModal: boolean
		formName: string
		formId: string
	}
}
