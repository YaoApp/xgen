import { X } from '@/components'

import type { IPropsFormRender } from '../types'
import type { Free } from '@/types'

const Index = (props: IPropsFormRender) => {
	const { item } = props
      const bind = item.bind as Free.FormBind
      
	return (
		<X
			type='base'
			name='Form'
			props={{ parent: 'Free', model: bind.model, id: bind.id, form: { type: bind.formType } }}
		></X>
	)
}

export default window.$app.memo(Index)
