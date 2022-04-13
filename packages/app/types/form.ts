import type { Action, Common } from '@/types'

export declare namespace FormType {
	interface Column extends Common.BaseColumn {
		tabs?: Array<Section>
	}

	type ColumnResult = { width?: number; tabs?: Array<SectionResult> } | Common.Column

	interface Section {
		title?: string
		desc?: string
		columns: Array<Column>
	}

	interface SectionResult {
		title?: string
		desc?: string
		columns: Array<ColumnResult>
	}

	interface Setting {
		primary: string
		operation: {
			preset: {
				save?: { back?: boolean }
				back?: {}
			}
			actions: Array<Action.Props>
		}
		form: {
			props: {}
			sections: Array<Section>
		}
		fileds: {
			form: Common.Fileds
		}
	}
}
