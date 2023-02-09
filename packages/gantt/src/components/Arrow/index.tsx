import { useMemo } from 'react'

import { drownPathAndTriangle, drownPathAndTriangleRTL } from './utils'

import type { IPropsArrow } from './types'

const Index = (props: IPropsArrow) => {
	const { taskFrom, taskTo, rowHeight, taskHeight, arrowIndent, rtl } = props

	const [path, trianglePoints] = useMemo(() => {
		return rtl
			? drownPathAndTriangleRTL({ taskFrom, taskTo, rowHeight, taskHeight, arrowIndent })
			: drownPathAndTriangle({ taskFrom, taskTo, rowHeight, taskHeight, arrowIndent })
	}, [taskFrom, taskTo, rowHeight, taskHeight, arrowIndent, rtl])

	return (
		<g className='arrow'>
			<path strokeWidth='1.5' d={path} fill='none' />
			<polygon points={trianglePoints} />
		</g>
	)
}

export default Index
