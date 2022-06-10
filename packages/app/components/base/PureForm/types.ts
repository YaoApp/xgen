import type Model from '@/components/base/Form/model'
import type { Common, FormType, Global } from '@/types'

export interface IPropsPureForm {
	parent: Model['parent']
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	id: Model['id']
	type: Model['type']
	data: Model['data']
	sections: Model['sections']
	operation: Model['setting']['operation']
	title: string
	onSave: (v: Global.AnyObject) => void
	onBack: () => void
}

export interface IPropsActions {
	locale_messages: Locale[keyof Locale]['actions']
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
	id: Model['id']
	operation: Model['setting']['operation']
	data: Model['data']
	onBack: IPropsPureForm['onBack']
	submit: () => void
}

export interface IPropsSections {
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
	data: Model['data']
	sections: Model['sections']
}

export interface IPropsSection {
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
	data: Model['data']
	item: FormType.SectionResult
}

export interface IPropsRowItem {
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
	data: Model['data']
	columns: Array<FormType.ColumnResult>
}

export interface IPropsFormItem {
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
	data: Model['data']
	item: Common.Column
}

export interface IPropsTabsItem {
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
	data: Model['data']
	item: FormType.TargetTab
}

export interface Locale {
	[key: string]: {
		actions: {
			back: string
			save: string
		}
	}
}
