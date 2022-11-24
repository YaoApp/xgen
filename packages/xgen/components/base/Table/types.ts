import type Model from './model'

export interface IPropsCustomAction {
	setting: Model['setting']
	namespace: string
	batch_columns: Model['batch_columns']
	batch: Model['batch']
	search: Model['search']
	setBatchActive: (v: boolean) => void
}
