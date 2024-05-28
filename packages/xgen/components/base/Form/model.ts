import { message } from 'antd'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { Namespace } from '@/models'
import { ColumnUtils, Common, Form } from '@/services'

import Service from './services'

import type { FormType, TableType, Component, Global } from '@/types'
import { Dot } from '@/utils'
import { isNumber } from 'lodash-es'

@injectable()
export default class Model {
	parent = 'Page' as Component.StackComponent['parent']
	model = '' as Component.StackComponent['model']
	id = 0 as Component.IdType
	type = '' as Component.FormType
	setting = {} as FormType.Setting
	data = {} as Global.AnyObject
	__data = {} as Global.AnyObject
	sections = [] as Array<FormType.SectionResult>
	frame = {} as FormType.Frame
	initialValues = {} as Global.AnyObject
	rendered = false
	form_name = ''
	parent_namespace = '' as Component.FormComponent['parentNamespace']
	onBack = undefined as Component.FormComponent['onBack']

	constructor(
		private service: Service,
		private common: Common,
		private form: Form,
		private column_utils: ColumnUtils,
		public global: GlobalModel,
		public namespace: Namespace
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting(setting?: FormType.Setting) {
		if (this.id === 0 && this.parent === 'Page') this.global.loading = true

		let target = {} as FormType.Setting

		if (setting) {
			target = setting
		} else {
			const { res, err } = await this.common.getSetting<FormType.Setting>('form', this.model)

			if (err) return

			target = res
		}

		if (this.id === 0) this.global.loading = false

		// get form default values
		for (const k in target.fields?.form) {
			const field = target.fields.form[k]
			if (field) {
				const bind = field.edit?.bind || field.bind
				const props = field.edit?.props || {}
				if (props.defaultValue !== undefined) {
					this.initialValues[bind] = props.defaultValue
					delete target.fields.form[k].edit.props.defaultValue
				}
			}
		}

		this.rendered = true
		this.setting = target
		this.sections = this.column_utils.reduceSections(target.form.sections || [], target.fields.form)
		this.frame = target.form.frame || ({} as FormType.Frame)
	}

	async find() {
		if (this.parent === 'Page' && this.rendered === false) this.global.loading = true

		const { res, err } = await this.service.find<any>(this.model, this.id)

		this.global.loading = false

		if (err) return Promise.reject()

		this.data = res
		return Promise.resolve()
	}

	async save(data: TableType.SaveRequest) {
		const hideLoading = message.loading(this.global.locale_messages.messages.table.save.loading)

		const { res, err } = await this.form.save<TableType.SaveRequest, TableType.SaveResponse>(this.model, data)

		hideLoading()

		if (err) return Promise.reject()

		message.success(this.global.locale_messages.messages.table.save.success)

		if (this.parent === 'Modal') {
			window.$app.Event.emit(`${this.parent_namespace ?? this.namespace.parent}/search`)
		}

		// Set id to the response if the id is 0 and the response is a string or number
		if (this.id === 0 && (typeof res == 'string' || isNumber(res)) && res !== 0) {
			this.id = res
		}

		return Promise.resolve(res)
	}

	async delete(primary_value: number) {
		const hideLoading = message.loading(this.global.locale_messages.messages.table.delete.loading)

		const { res, err } = await this.form.delete<TableType.DeleteResponse>(this.model, primary_value)

		hideLoading()

		if (err) return Promise.reject()

		message.success(this.global.locale_messages.messages.table.delete.success)

		if (this.parent === 'Modal')
			window.$app.Event.emit(`${this.parent_namespace ?? this.namespace.parent}/search`)

		return Promise.resolve(res)
	}

	init(
		parent: Component.StackComponent['parent'],
		parentNamespace: Component.FormComponent['parentNamespace'],
		model: Component.StackComponent['model'],
		id: Required<Component.StackComponent>['id'],
		form: Component.StackComponent['form'],
		onBack: Component.FormComponent['onBack']
	) {
		this.setting = {} as FormType.Setting
		this.data = {} as Global.AnyObject

		this.form_name = `Form-${parent}-${model}`
		this.parent_namespace = parentNamespace
		this.global.stack.push(this.form_name)

		this.namespace.paths = toJS(this.global.stack.paths)

		this.rendered = false
		this.parent = parent
		this.model = model
		this.id = id === '0' ? 0 : id
		this.type = form!.type

		this.getSetting()

		if (this.id !== 0) this.find()

		this.onBack = onBack
		this.on()
	}

	refetch() {
		this.getSetting()
		this.find()
	}

	back() {
		if (this.parent === 'Modal') {
			window.$app.Event.emit(`${this.parent_namespace ?? this.namespace.parent}/search`)
		}
		this.onBack!()
	}

	on() {
		window.$app.Event.on(`${this.namespace.value}/find`, this.find)
		window.$app.Event.on(`${this.namespace.value}/save`, this.save)
		window.$app.Event.on(`${this.namespace.value}/delete`, this.delete)
		window.$app.Event.on(`${this.namespace.value}/back`, this.back)
		window.$app.Event.on(`${this.namespace.value}/refetch`, this.refetch)
	}

	off() {
		window.$app.Event.off(`${this.namespace.value}/find`, this.find)
		window.$app.Event.off(`${this.namespace.value}/save`, this.save)
		window.$app.Event.off(`${this.namespace.value}/delete`, this.delete)
		window.$app.Event.off(`${this.namespace.value}/back`, this.back)
		window.$app.Event.off(`${this.namespace.value}/refetch`, this.refetch)
		this.global.stack.remove(this.form_name)
	}
}
