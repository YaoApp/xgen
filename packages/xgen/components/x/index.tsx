import { message } from 'antd'
import { lazy, Suspense, useMemo } from 'react'

import type { Global } from '@/types'

type ComponentsType = 'base' | 'edit' | 'view' | 'chart' | 'group' | 'optional'

interface IProps {
	type: ComponentsType
	name: string
	props: Global.AnyObject
}

const Index = ({ type, name, props }: IProps) => {
	const Component = useMemo(() => {
		if (name.startsWith('public/')) {
			const { origin } = window.location
			const component_name = name.replace('public/', '')

			return lazy(() =>
				// @ts-ignore
				System.import(`${origin}/components/${component_name}.js`).catch(() => {
					message.error(`Component is not exist, type:'${type}' name:'${name}'`)
				})
			)
		}

		return lazy(() =>
			import(`@/components/${type}/${name}`).catch(() => {
				message.error(`Component is not exist, type:'${type}' name:'${name}'`)
			})
		)
	}, [type, name])

	return (
		<Suspense fallback={null}>
			<Component {...props} />
		</Suspense>
	)
}

export default window.$app.memo(Index)
