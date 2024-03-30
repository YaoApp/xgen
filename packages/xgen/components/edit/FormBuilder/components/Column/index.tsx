import Input from '@/components/edit/Input'
import { message } from 'antd'
import { Suspense, lazy, useMemo } from 'react'
import type { Global } from '@/types'

interface IProps {
	name: string
	props: Global.AnyObject
}

const Index = ({ name, props }: IProps) => {
	const type = 'edit'
	const Component = useMemo(() => {
		return lazy(() =>
			import(`@/components/builder/${name}`).catch(() => {
				message.error(`Component is not exist, type:'${type}' name:'${name}'`)
			})
		)
	}, [name])

	return (
		<Suspense fallback={null}>
			<Component {...props} />
		</Suspense>
	)
}

export default window.$app.memo(Index)
