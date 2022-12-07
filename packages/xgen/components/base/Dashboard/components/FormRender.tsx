import { X } from '@/components'

import type { IPropsFormRender } from '../types'
import type { Dashboard } from '@/types'

const Index = (props: IPropsFormRender) => {
	const { item } = props
      const bind = item.bind as Dashboard.FormBind
      
	return (
		<X
			type='base'
			name='Form'
			props={{ parent: 'Dashboard', model: bind.model, id: bind.id, form: { type: bind.formType } }}
		></X>
	)
}

export default window.$app.memo(Index)
