import { X } from '@/components'

import { getRender } from '../utils'

import type { Common } from '@/types'
import type { IPropsBlock } from '../types'

type Elements = { [key: string]: JSX.Element }

const Index = (props: IPropsBlock) => {
	const { namespace, primary, type, components, data_item } = props

	const elements: Elements = {}

	for (const key in components) {
		const field_detail = components[key] as Common.Column

		elements[key] = getRender(namespace, primary, field_detail, data_item)
	}

	return <X type='group' name={type} props={elements}></X>
}

export default window.$app.memo(Index)
