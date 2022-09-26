import type { Action, Common } from '@/types'

export declare namespace FormType {
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

	interface RawTab {
		width?: number
		tabs: Array<Section>
	}

	interface TargetTab {
		width?: number
		tabs: Array<SectionResult>
	}

	type Column = Common.BaseColumn | RawTab

	type ColumnResult = Common.Column | TargetTab

	interface Setting {
		name: string
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
		fields: {
			form: Common.Fields
		}
		config: {
			showAnchor?: boolean
		}
	}
}
