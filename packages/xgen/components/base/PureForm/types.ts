import type Model from '@/components/base/Form/model'
import type { Common, FormType, Global } from '@/types'
import type { RefObject } from 'react'

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
	props: Model['setting']['form']['props']
	disabledActionsAffix?: boolean
	frame?: Model['frame']
	initialValues?: Global.AnyObject
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
	showSectionDivideLine: Model['setting']['form']['props']['showSectionDivideLine']
}

export interface IPropsSection {
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	type: Model['type']
	item: FormType.SectionResult
	showSectionDivideLine: IPropsSections['showSectionDivideLine']
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

export interface IPropsReference {
	parent: Model['parent']
	namespace: Model['namespace']['value']
	data: Model['data']
	reference: Model['setting']['form']['props']['reference']
	container: RefObject<HTMLDivElement>
	visible_flat_content: boolean
	toggleFlatContent: () => void
}

export interface IPropsReferenceFlatContent {
	parent: Model['parent']
	namespace: Model['namespace']['value']
	flatContent: FormType.Reference['flatContent']
	visible_flat_content: IPropsReference['visible_flat_content']
	toggleFlatContent: IPropsReference['toggleFlatContent']
}

export interface IPropsReferenceFloatContentItem {
	item: FormType.FloatContentItem
	container: RefObject<HTMLDivElement>
}

export interface Locale {
	[key: string]: {
		actions: {
			back: string
			save: string
		}
	}
}
