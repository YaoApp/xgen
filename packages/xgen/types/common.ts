export declare namespace Common {
	interface Config {
		full?: boolean
      }

	interface BaseColumn {
		name: string
		width?: number
	}

	interface WideColumn {
		name: string
		width: number
	}

	interface ViewComponents {
		[key: string]: string | FieldDetail
	}

	interface FieldDetail {
		bind: string
		view: {
			bind?: string
			type: string
			props: any
			components?: ViewComponents
		}
		edit: {
			bind?: string
			type: string
			props: any
		}
	}

	type EditFieldDetail = Omit<FieldDetail, 'view'>

	interface Fields {
		[key: string]: FieldDetail
	}

	interface EditFields {
		[key: string]: EditFieldDetail
	}

	interface Column extends BaseColumn, FieldDetail {}

	interface EditColumn extends BaseColumn, EditFieldDetail {}
}
