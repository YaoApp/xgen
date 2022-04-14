import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Page, PureForm } from '@/components'
import { getLocale } from '@umijs/max'

import Breadcrumb from './components/Breadcrumb'
import { usePageTitle } from './hooks'
import styles from './index.less'
import locales from './locales'
import Model from './model'

import type { Component } from '@/types'
import type { IPropsPureForm } from '@/components/base/PureForm/types'
import type { IPropsBreadcrumb } from './types'

const Index = (props: Component.FormComponent) => {
	const { parent, model, id, form, onBack } = props
	const [x] = useState(() => container.resolve(Model))
	const locale = getLocale()
	const locale_messages = locales[locale]
	const page_title_prefix = usePageTitle(locale_messages, id!, form!.type)
	const title = page_title_prefix + x.setting.name

	useLayoutEffect(() => {
		x.init(parent, model, id, form)

		return () => {
			x.off()
		}
	}, [x, parent, model, id, form])

	if (!x.setting.form) return null

	const props_breadcrumb: IPropsBreadcrumb = {
		model,
		name: x.setting.name,
		title
	}

	const props_form: IPropsPureForm = {
		parent,
		namespace: x.namespace.value,
		primary: x.setting.primary,
		type: x.type,
		id: x.id,
		data: x.data,
		sections: x.sections,
		operation: x.setting.operation,
		title,
		onSave(v) {
			window.$app.Event.emit(`${x.namespace.value}/save`, {
				...v,
				[x.setting.primary]: x.id
			})
		},
		onBack() {
			if (onBack) return onBack()

			history.back()
		}
	}

	if (parent === 'Page') {
		return (
			<Page className={clsx([styles._local, 'w_100 flex flex_column'])} title={title}>
				<Breadcrumb {...props_breadcrumb}></Breadcrumb>
				<PureForm {...props_form}></PureForm>
			</Page>
		)
	}

	return (
		<div className={clsx([styles._local, 'w_100'])}>
			<PureForm {...props_form}></PureForm>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
