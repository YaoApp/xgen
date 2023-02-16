import { useMemo } from 'react'

import type { IPropsContent } from '../../../types'

interface HookProps extends Pick<IPropsContent, 'columnWidth' | 'dates' | 'timeStep'> {}

export default (props: HookProps) => {
	const { columnWidth, dates, timeStep } = props

	return useMemo(() => {
		const dateDelta =
			dates[1].getTime() -
			dates[0].getTime() -
			dates[1].getTimezoneOffset() * 60 * 1000 +
			dates[0].getTimezoneOffset() * 60 * 1000

		return (timeStep * columnWidth) / dateDelta
	}, [columnWidth, dates, timeStep])
}
