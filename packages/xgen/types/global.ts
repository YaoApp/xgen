export type BaseType = 'table' | 'form' | 'chart' | 'list' | 'dashboard'

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

	interface AnyObject {
		[key: string]: any
	}

	interface Match {
		type: string
		model: string
		id?: string
		formType?: 'view' | 'edit'
	}
}
