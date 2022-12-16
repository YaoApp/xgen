import { useMemoizedFn } from 'ahooks'
import clsx from 'clsx'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Page, PureForm } from '@/components'
import { getLocale } from '@umijs/max'

import Anchor from './components/Anchor'
import Breadcrumb from './components/Breadcrumb'
import { useHooks, usePageTitle } from './hooks'
import styles from './index.less'
import locales from './locales'
import Model from './model'

import type { Component } from '@/types'
import type { IPropsPureForm } from '@/components/base/PureForm/types'
import type { IPropsBreadcrumb, IPropsAnchor } from './types'

const Index = (props: Component.FormComponent) => {
	const { parent, model, id, form, onBack } = props
	const [x] = useState(() => container.resolve(Model))
	const locale = getLocale()
	const page_title_prefix = usePageTitle(locales[locale], id!, form!.type)
	const hooks = useHooks(toJS(x.setting.hooks!), toJS(x.setting.fields), toJS(x.data))
	const title = page_title_prefix + x.setting.name

	const onFormBack = useMemoizedFn(() => {
		if (onBack) {
			onBack()

			return Promise.resolve()
		}

		history.back()

		return Promise.resolve()
	})

	useLayoutEffect(() => {
		x.init(parent, model, id, form, onFormBack)

		return () => {
			x.off(onFormBack)
		}
	}, [parent, model, id, form, onFormBack])

	const onSave = useMemoizedFn((v) => {
		const data = { ...v }

		if (x.id !== 0) data[x.setting.primary] = x.id

		return window.$app.Event.emit(`${x.namespace.value}/save`, data)
	})

	const setSetting = useMemoizedFn((v) => (x.setting = v))

	if (!x.setting.form) return null

	const props_breadcrumb: IPropsBreadcrumb = {
		model,
		name: x.setting.name,
		title
	}

	const props_anchor: IPropsAnchor = {
		sections: toJS(x.setting.form.sections)
	}

	const props_form: IPropsPureForm = {
		parent,
		namespace: x.namespace.value,
		primary: x.setting.primary,
		type: x.type,
		id: x.id,
		data: toJS(x.data),
		sections: toJS(x.sections),
		actions: toJS(x.setting.actions),
		hooks,
		title,
		disabledActionsAffix: parent === 'Dashboard',
		setSetting,
		onSave
	}

	if (parent === 'Page') {
		return (
			<Page className={clsx([styles._local, 'w_100'])} title={title} full={x.setting?.config?.full}>
				<div className='flex relative'>
					<div className='w_100 flex flex_column'>
						<Breadcrumb {...props_breadcrumb}></Breadcrumb>
						<PureForm {...props_form}></PureForm>
					</div>
					{x.setting?.config?.showAnchor && (
						<div className='anchor_wrap absolute top_0'>
							<Anchor {...props_anchor}></Anchor>
						</div>
					)}
				</div>
			</Page>
		)
	}

	return (
		<div className={styles._local}>
			<PureForm {...props_form}></PureForm>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
