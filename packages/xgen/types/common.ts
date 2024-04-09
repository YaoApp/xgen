export declare namespace Common {
	interface Config {
		full?: boolean
	}

	interface BaseColumn {
		name: string
		width?: number
		icon?: string | { name: string; size?: number }
		color?: string
		weight?: number | string
	}

	interface TableBaseColumn extends BaseColumn {
		fixed?: boolean
	}

	interface WideColumn {
		name: string
		width: number
	}

	interface ViewComponents {
		[key: string]: string | FieldDetail
	}

	interface AIConfig {
		placeholder?: string
	}

	interface FieldDetail {
		id: string
		bind: string
		view: {
			bind?: string
			type: string
			props: any & { components?: ViewComponents }
		}
		edit: {
			bind?: string
			type: string
			props: any & { ai?: AIConfig }
		}
	}

	type ViewFieldDetail = Omit<FieldDetail, 'edit'>
	type EditFieldDetail = Omit<FieldDetail, 'view'>

	interface Fields {
		[key: string]: FieldDetail
	}

	interface ViewFields {
		[key: string]: ViewFieldDetail
	}

	interface EditFields {
		[key: string]: EditFieldDetail
	}

	interface Column extends BaseColumn, FieldDetail {}
	interface TableColumn extends TableBaseColumn, FieldDetail {}
	interface EditColumn extends BaseColumn, EditFieldDetail {}
}
