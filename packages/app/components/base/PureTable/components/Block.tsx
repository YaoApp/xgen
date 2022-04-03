import { X } from '@/components'
import { getDeepValue } from '@yaoapp/utils'

import { getRender } from '../utils'

import type { ViewComponents, Column } from '@/types'

interface IProps {
	type: string
	components: ViewComponents
	data_item: unknown
}

type Elements = { [key: string]: JSX.Element }

const Index = (props: IProps) => {
	const { type, components, data_item } = props

	const elements: Elements = {}

	for (const key in components) {
		const filed_detail = components[key] as Column
		const value = getDeepValue(filed_detail.bind, data_item)

		elements[key] = getRender(filed_detail, value)
	}

	return <X type='group' name={type} props={elements}></X>
}

export default window.$app.memo(Index)
