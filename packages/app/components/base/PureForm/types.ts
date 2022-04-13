import type Model from '@/components/base/Form/model'

export interface IPropsPureForm {
	parent: Model['parent']
	namespace: Model['namespace']['value']
	primary: Model['setting']['primary']
	data: Model['data']
	sections: Model['sections']
	operation: Model['setting']['operation']
}
