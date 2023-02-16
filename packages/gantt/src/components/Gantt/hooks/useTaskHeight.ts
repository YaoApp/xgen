import { useMemo } from 'react'

import type { GanttProps } from '@/types'

interface HookProps extends Pick<GanttProps, 'rowHeight' | 'barFill'> {}

export default (props: HookProps) => {
	const { rowHeight, barFill } = props

	return useMemo(() => (rowHeight! * barFill!) / 100, [rowHeight, barFill])
}
