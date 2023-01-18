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
	actions: Model['setting']['actions']
	hooks: Model['setting']['hooks']
	title: string
	disabledActionsAffix?: boolean
	onLoadSync?: Model['setting']['form']['props']['onLoadSync']
	setData: (v: Global.AnyObject) => void
	setSetting: (v: FormType.Setting) => void
	onSave: (v: Global.AnyObject) => Promise<void>
}

export interface IPropsActions {
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
	id: Model['id']
	actions: Model['setting']['actions']
	data: Model['data']
	disabledActionsAffix: IPropsPureForm['disabledActionsAffix']
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
	item: FormType.SectionResult
}

export interface IPropsRowItem {
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
	columns: Array<FormType.ColumnResult>
}

export interface IPropsFormItem {
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
	item: Common.EditColumn
}

export interface IPropsTabsItem {
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
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
