import { message } from 'antd'
import { Suspense, lazy, useMemo } from 'react'
import type { Global } from '@/types'
import { retryUntil } from '@/utils'

interface IProps {
	name: string
	props: Global.AnyObject
}

const Index = ({ name, props }: IProps) => {
	const type = 'edit'
	const Component = useMemo(() => {
		return lazy(() => {
			const component = import(`@/components/builder/${name}`).catch(() => {
				message.error(`Component is not exist, type:'${type}' name:'${name}'`)
				console.error(`Component is not exist, type:'${type}' name:'${name}'`, props)
				return { default: () => null }
			})
			return component
		})
	}, [name])

	return (
		<Suspense fallback={null}>
			<Component {...props} />
		</Suspense>
	)
}

export default window.$app.memo(Index)
