import type { Action, Common } from '@/types'

export declare namespace FormType {
	interface Section {
		title?: string
		desc?: string
		columns: Array<Common.BaseColumn | { tabs: Array<Section> }>
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
