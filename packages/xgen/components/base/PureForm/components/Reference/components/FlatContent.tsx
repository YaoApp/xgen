import { useToggle } from 'ahooks'
import clsx from 'clsx'
import { ArrowLineRight } from 'phosphor-react'
import { Fragment, useEffect, useMemo } from 'react'
import { Case, Switch, When } from 'react-if'

import { X } from '@/components'

import styles from '../index.less'

import type { IPropsReferenceFlatContent } from '../../../types'

const Index = (props: IPropsReferenceFlatContent) => {
	const { parent, namespace, flatContent, visible_flat_content, toggleFlatContent } = props

	const { parent_container, parent_width, flat_content_width } = useMemo(() => {
		if (parent !== 'Modal') return {}
		if (!flatContent) return {}

		const raw_width = flatContent?.payload?.width || 600
		const flat_content_width = typeof raw_width === 'number' ? `${raw_width}px` : raw_width
		const paths = namespace.split('/')

		paths.pop()

		const parent_id = `${paths.join('/')}=>__modal_container`
		const parent_container = document.querySelector(
			`[id='${parent_id}'] .__open_modal_content_wrap`
	      )! as HTMLDivElement

		if (!parent_container) return {}

		const parent_width = getComputedStyle(parent_container).getPropertyValue('width')

		return { parent_container, parent_width, flat_content_width }
	}, [parent, namespace, flatContent])

	useEffect(() => {
		if (!parent_container) return

		const modal_width = `${parent_width} + ${visible_flat_content ? flat_content_width : '0px'}`

		parent_container.style.setProperty('width', `calc(${modal_width})`)
	}, [visible_flat_content, parent_container, parent_width, flat_content_width])

	return (
		<Fragment>
			<button
				className={clsx([
					styles.button,
					styles.flat,
					'border_box flex flex_column justify_center align_center cursor_point absolute'
				])}
				style={{ top: 12 }}
				onClick={toggleFlatContent}
			>
				<When condition={visible_flat_content}>
					<ArrowLineRight className='icon_close' size={16}></ArrowLineRight>
				</When>
				{flatContent?.name}
			</button>
			<When condition={visible_flat_content}>
				<div
					className={clsx([styles.flat_content_wrap, 'flex'])}
					style={{ width: flatContent?.payload?.width || 600 }}
				>
					<Switch>
						<Case condition={!!flatContent?.payload?.Form}>
							<X
								type='base'
								name='Form'
								props={{
									parent: 'Form',
									model: flatContent?.payload?.Form?.model,
									id: flatContent?.payload?.Form?.id,
									form: { type: flatContent?.payload?.Form?.type },
									onBack: toggleFlatContent
								}}
							></X>
						</Case>
						<Case condition={!!flatContent?.payload?.Page}></Case>
					</Switch>
				</div>
			</When>
		</Fragment>
	)
}

export default window.$app.memo(Index)
