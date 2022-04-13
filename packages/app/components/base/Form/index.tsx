import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Page, PureForm } from '@/components'
import { getLocale } from '@umijs/max'

import { usePageTitle } from './hooks'
import styles from './index.less'
import locales from './locales'
import Model from './model'

import type { Component } from '@/types'
import type { IPropsPureForm } from '@/components/base/PureForm/types'

const Index = (props: Component.StackComponent) => {
	const { parent, model, id, form } = props
	const [x] = useState(() => container.resolve(Model))
	const locale = getLocale()
	const locale_messages = locales[locale]
	const page_title_prefix = usePageTitle(locale_messages, id, form!.type)

	useLayoutEffect(() => {
		x.init(parent, model, id, form)

		return () => {
			x.off()
		}
	}, [x, parent, model, id, form])

	if (!x.setting.form) return null

	const props_form: IPropsPureForm = {
		parent,
		namespace: x.namespace.value,
		primary: x.setting.primary,
		data: x.data,
		sections: x.sections,
		operation: x.setting.operation
	}

	if (parent === 'Page') {
		return (
			<Page className={clsx([styles._local, 'w_100'])} titlePrefix={page_title_prefix}>
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
