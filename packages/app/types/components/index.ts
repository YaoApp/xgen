export declare namespace Component {
	interface Params {
		[key: string]: any
	}

	interface Request {
		api: string
		params?: { [key: string]: `:${string}` | string }
	}

	interface Option {
		label: string
		value: string
		color?: string
	}

	type Options = Array<Option>
}
