import { X } from '@/components'
import { getDeepValue } from '@yaoapp/utils'

import { getRender } from '../utils'

import type { ViewComponents, Column } from '@/types'

interface IProps {
	type: string
	components: ViewComponents
	data_item: any
	row_index: number
}

type Elements = { [key: string]: JSX.Element }

const Index = (props: IProps) => {
	const { type, components, data_item, row_index } = props

	const elements: Elements = {}

	for (const key in components) {
		const field_detail = components[key] as Column

		elements[key] = getRender(field_detail, data_item, row_index)
	}

	return <X type='group' name={type} props={elements}></X>
}

export default window.$app.memo(Index)
