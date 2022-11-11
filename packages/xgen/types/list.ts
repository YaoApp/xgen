import type { Common } from '@/types'

export declare namespace List {
	interface Setting {
		list: {
			columns: Array<Common.BaseColumn>
		}
		fields: {
			list: Common.EditFields
		}
		config?: Common.Config
	}
}
