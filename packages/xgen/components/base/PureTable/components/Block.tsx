import { useMemo } from 'react'

import { Block } from '@/components/group'

import { Render } from '../utils'

import type { Common } from '@/types'
import type { IPropsBlock } from '../types'

const Index = (props: IPropsBlock) => {
	const { namespace, primary, type, components, data_item } = props

	const elements = useMemo(() => {
		const elements: any = {}

		for (const key in components) {
			const field_detail = components[key] as Common.Column

			elements[key] = <Render {...{ namespace, primary, field_detail, data_item }} />
		}

		return elements
	}, [namespace, primary, components, data_item])

	if (type === 'Block') return <Block {...elements} />

	return null
}

export default window.$app.memo(Index)
