import { useEffect, useMemo, useRef } from 'react'

import styles from './index.css'

import type { IPropsHorizontalScroll } from './types'

const Index = (props: IPropsHorizontalScroll) => {
	const { scroll, svgWidth, taskListWidth, rtl, onScroll } = props
	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (scrollRef.current) scrollRef.current.scrollLeft = scroll
	}, [scroll])

	const style = useMemo(() => {
		return { margin: rtl ? `0px ${taskListWidth}px 0px 0px` : `0px 0px 0px ${taskListWidth}px` }
	}, [rtl, taskListWidth])

	return (
		<div className={styles.scrollWrapper} dir='ltr' style={style} ref={scrollRef} onScroll={onScroll}>
			<div style={{ width: svgWidth }} className={styles.scroll} />
		</div>
	)
}

export default Index
