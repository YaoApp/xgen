import { useEffect, useMemo, useRef } from 'react'

import styles from './index.css'

import type { IPropsVerticalScroll } from './types'

const Index = (props: IPropsVerticalScroll) => {
	const { scroll, ganttHeight, ganttFullHeight, headerHeight, rtl, onScroll } = props
	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (scrollRef.current) scrollRef.current.scrollTop = scroll
	}, [scroll])

	const style = useMemo(() => {
		return { height: ganttHeight, marginTop: headerHeight, marginLeft: rtl ? '' : '-1rem' }
	}, [rtl, ganttHeight, headerHeight])

	return (
		<div className={styles.scrollWrapper} ref={scrollRef} style={style} onScroll={onScroll}>
			<div style={{ height: ganttFullHeight, width: 1 }} />
		</div>
	)
}

export default Index
