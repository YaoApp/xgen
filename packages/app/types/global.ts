export declare namespace Global {
	interface StringObject {
		[key: string]: string
	}

	interface NumberObject {
		[key: string]: number
	}

	interface BooleanObject {
		[key: string]: boolean
	}

	interface Match {
		type: string
		model: string
		id?: string
		formType?: 'view' | 'edit'
	}
}
