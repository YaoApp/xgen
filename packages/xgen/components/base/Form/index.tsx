import { useFullscreen, useMemoizedFn } from 'ahooks'
import clsx from 'clsx'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { container } from 'tsyringe'

import { Page, PureForm } from '@/components'
import { getLocale } from '@umijs/max'

import Anchor from './components/Anchor'
import Breadcrumb from './components/Breadcrumb'
import { useHooks, usePageTitle } from './hooks'
import styles from './index.less'
import { Message } from './locales'
import Model from './model'

import type { Component } from '@/types'
import type { IPropsPureForm } from '@/components/base/PureForm/types'
import type { IPropsBreadcrumb, IPropsAnchor } from './types'
import { Bind, Dot } from '@/utils'
import { useGlobal } from '@/context/app'
import { IPropsActions } from '../PureForm/types'
import Actions from '../PureForm/components/Actions'

const Index = (props: Component.FormComponent) => {
	const { parent, parentNamespace, model, id, form, onBack } = props
	const [x] = useState(() => container.resolve(Model))
	const locale = getLocale()
	const page_title_prefix = usePageTitle(Message(locale), id!, form!.type)
	const hooks = useHooks(toJS(x.setting.hooks!), toJS(x.setting.fields), toJS(x.data))
	const ref_container = useRef<HTMLDivElement>(null)
	const [is_fullscreen, { toggleFullscreen }] = useFullscreen(ref_container)

	const global = useGlobal()
	const { layout } = global

	const title = useMemo(() => {
		if (x.setting?.config?.viewTitle && x.type === 'view') {
			return Bind(x.setting.config.viewTitle, x.data) || x.setting.config.viewTitle
		}

		if (x.setting?.config?.editTitle && x.type === 'edit') {
			return Bind(x.setting.config.editTitle, x.data) || x.setting.config.editTitle
		}

		return page_title_prefix + x.setting.name
	}, [
		page_title_prefix,
		x.setting.name,
		x.type,
		x.setting?.config?.viewTitle,
		x.setting?.config?.editTitle,
		x.data
	])

	const onFormBack = useMemoizedFn(() => {
		if (onBack) {
			onBack()

			return Promise.resolve()
		}

		history.back()

		return Promise.resolve()
	})

	useLayoutEffect(() => {
		x.init(parent, parentNamespace, model, id!, form, onFormBack)

		window.$app.Event.on(`${x.namespace.value}/fullscreen`, toggleFullscreen)

		return () => {
			x.off()
			window.$app.Event.off(`${x.namespace.value}/fullscreen`, toggleFullscreen)
		}
	}, [parent, parentNamespace, model, id, form, onFormBack])

	const onSave = useMemoizedFn((v) => {
		const data = { ...v }

		if (x.id !== 0) data[x.setting.primary] = x.id

		return window.$app.Event.emit(`${x.namespace.value}/save`, data)
	})

	const setData = useMemoizedFn((v) => (x.data = { ...x.data, ...v }))
	const setSetting = useMemoizedFn((v) => x.getSetting(v))

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
		frame: toJS(x.setting.form.frame),
		hooks,
		title,
		props: toJS(x.setting.form?.props),
		initialValues: toJS(x.initialValues),
		disabledActionsAffix: parent === 'Dashboard',
		setData,
		setSetting,
		onSave
	}

	if (parent === 'Page') {
		// Form actions
		let form_actions = undefined
		if (layout == 'Chat' && props_form.parent != 'Modal') {
			const props_actions: IPropsActions = {
				namespace: props_form.namespace,
				primary: props_form.primary,
				type: props_form.type,
				id: props_form.id,
				actions: props_form.actions || [],
				data: props_form.data,
				disabledActionsAffix: true
			}
			form_actions = <Actions {...props_actions}></Actions>
		}

		return (
			<Page
				className={clsx([styles._local, 'w_100'])}
				title={title}
				full={x.setting?.config?.full}
				type={'Form'}
				formActions={form_actions}
			>
				<div className='flex relative'>
					<div className='w_100 flex flex_column'>
						{!x.setting?.config?.hideBreadcrumb && (
							<Breadcrumb {...props_breadcrumb}></Breadcrumb>
						)}
						<div
							className={clsx([is_fullscreen && styles.fullscreen, 'w_100'])}
							ref={ref_container}
						>
							<PureForm {...props_form}></PureForm>
						</div>
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
		<div className={clsx([styles._local, is_fullscreen && styles.fullscreen, 'w_100'])} ref={ref_container}>
			<PureForm {...props_form}></PureForm>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
