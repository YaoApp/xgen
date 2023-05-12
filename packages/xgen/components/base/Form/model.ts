import { message } from 'antd'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { Namespace } from '@/models'
import { ColumnUtils, Common, Form } from '@/services'

import Service from './services'

import type { FormType, TableType, Component, Global } from '@/types'

@injectable()
export default class Model {
	parent = 'Page' as Component.StackComponent['parent']
	model = '' as Component.StackComponent['model']
	id = 0 as Component.IdType
	type = '' as Component.FormType
	setting = {} as FormType.Setting
	data = {} as Global.AnyObject
	sections = [] as Array<FormType.SectionResult>
	rendered = false
	form_name = ''
	parent_namespace = '' as Component.FormComponent['parentNamespace']

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

		this.rendered = true
		this.setting = target
		this.sections = this.column_utils.reduceSections(target.form.sections || [], target.fields.form)
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

		if (this.parent === 'Modal')
			window.$app.Event.emit(`${this.parent_namespace ?? this.namespace.parent}/search`)

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
		id: Component.StackComponent['id'],
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
		this.id = Number(id)
		this.type = form!.type

		this.getSetting()

		if (Number(id) !== 0) this.find()

		this.on(onBack)
	}

	refetch() {
		this.getSetting()
		this.find()
	}

	on(onBack: Component.FormComponent['onBack']) {
		window.$app.Event.on(`${this.namespace.value}/find`, this.find)
		window.$app.Event.on(`${this.namespace.value}/save`, this.save)
		window.$app.Event.on(`${this.namespace.value}/delete`, this.delete)
		window.$app.Event.on(`${this.namespace.value}/back`, onBack!)
		window.$app.Event.on(`${this.namespace.value}/refetch`, this.refetch)
	}

	off(onBack: Component.FormComponent['onBack']) {
		window.$app.Event.off(`${this.namespace.value}/find`, this.find)
		window.$app.Event.off(`${this.namespace.value}/save`, this.save)
		window.$app.Event.off(`${this.namespace.value}/delete`, this.delete)
		window.$app.Event.off(`${this.namespace.value}/back`, onBack!)
		window.$app.Event.off(`${this.namespace.value}/refetch`, this.refetch)

		this.global.stack.remove(this.form_name)
	}
}
