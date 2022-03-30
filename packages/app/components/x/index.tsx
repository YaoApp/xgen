import { message } from 'antd'
import { lazy, Suspense } from 'react'

type ComponentsType = 'base' | 'form' | 'chart' | 'group' | 'option'

interface IProps {
	type: ComponentsType
	name: string
	props: { [key: string]: any }
}

const Index = ({ type, name, props }: IProps) => {
	const Component = lazy(() =>
		import(`@/components/${type}/${name}`).catch(() => {
			message.error(`Component is not exist, type:'${type}' name:'${name}'`)
		})
	)

	return (
		<Suspense fallback={null}>
			<Component {...props} />
		</Suspense>
	)
}

export default window.$app.memo(Index)
