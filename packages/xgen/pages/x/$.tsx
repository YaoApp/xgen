import { X } from '@/components'
import { useMatch } from '@/hooks'
import { history } from '@umijs/max'

import type { Global } from '@/types'

/** Dynamically forward to the components */
const Index = () => {
	const { type, model, id, formType } = useMatch<Global.Match>(
		/^\/x\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/,
		['type', 'model', 'id', 'formType']
	)

	if (!model) history.push('/404')

	return <X type='base' name={type} props={{ parent: 'Page', model, id, form: { type: formType } }}></X>
}

export default Index
