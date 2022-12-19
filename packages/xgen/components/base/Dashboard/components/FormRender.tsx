import { X } from '@/components'

import type { IPropsFormRender } from '../types'

const Index = (props: IPropsFormRender) => {
	const { item } = props
	const { model, id, formType } = item.view.props

	return <X type='base' name='Form' props={{ parent: 'Dashboard', model, id, form: { type: formType } }}></X>
}

export default window.$app.memo(Index)
