import type Model from '@/components/base/Form/model'
import type { FormType } from '@/types'

export interface IPropsPureForm {
	parent: Model['parent']
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	data: Model['data']
	sections: Model['sections']
	operation: Model['setting']['operation']
	title: string
}

export interface IPropsActions {}

export interface IPropsSections {
	sections: Model['sections']
}

export interface IPropsSection {
	item: FormType.SectionResult
}
