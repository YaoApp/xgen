import { isPlainObject } from 'lodash-es'
import Mustache from 'mustache'
import { Dot } from '../bind'

type Template = Array<string | number | object> | string | number | boolean | Record<string, any>

type FunctionType = <T>(template: Template & T, data: Record<string, any>) => T

const Index: FunctionType = (template, data) => {
	if (typeof template === 'string') {
		return Mustache.render(template, Dot(data))
		// return Mustache.render(template, data)
	}

	if (typeof template === 'boolean' || typeof template === 'number') {
		return template
	}

	if (Array.isArray(template)) {
		return template.map((item: any) => Index(item, data))
	}

	if (isPlainObject(template)) {
		return Object.keys(template).reduce((total: any, key) => {
			total[key] = Index(template[key], data)

			return total
		}, {})
	}
}

export default Index
