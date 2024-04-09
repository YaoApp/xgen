import type { Action, Common, Global } from '@/types'

export declare namespace FormType {
	interface Section {
		title?: string
		desc?: string
		icon?: string | { name: string; size?: number }
		color?: string
		weight?: number | string
		columns: Array<Column>
	}

	interface Frame {
		url: string
		params?: Record<string, string>
	}

	interface SectionResult {
		title?: string
		desc?: string
		icon?: string | { name: string; size?: number }
		color?: string
		weight?: number | string
		columns: Array<ColumnResult>
	}

	interface RawTab {
		width?: number
		icon?: string | { name: string; size?: number }
		color?: string
		weight?: number | string
		tabs: Array<Section>
	}

	interface TargetTab {
		width?: number
		tabs: Array<SectionResult>
	}

	type Column = Common.BaseColumn | RawTab

	type ColumnResult = Common.EditColumn | TargetTab

	type HookArgs = { api: string; params: Global.AnyObject }
	type HookType = { [key: string]: HookArgs }

	type HookKeys = 'onChange'

	interface OpenRef {
		Form?: {
			type: 'view' | 'edit'
			model: string
			id: string
		}
		Page?: {
			type: 'chart'
			model: string
			id: string
		}
	}

	interface FloatContentItem {
		name: string
		payload: OpenRef
	}

	interface Reference {
		flatContent?: {
			name: string
			defaultOpen?: boolean
			payload: OpenRef & { width?: number | string }
		}
		floatContents?: Array<FloatContentItem>
	}

	interface Setting {
		name: string
		primary: string
		hooks?: {
			[key in HookKeys]: HookType
		}
		actions?: Array<Action.Props>
		form: {
			props: {
				onLoadSync?: boolean
				reference?: Reference
				showSectionDivideLine?: boolean
			}
			sections: Array<Section>
			frame?: Frame
		}
		fields: {
			form: Common.EditFields
		}
		config?: Common.Config & {
			hideBreadcrumb?: boolean
			showAnchor?: boolean
			viewTitle?: string
			editTitle?: string
		}
	}
}
