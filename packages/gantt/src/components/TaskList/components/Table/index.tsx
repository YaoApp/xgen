import { useMemo } from 'react'

import styles from './index.css'
import Row from './Row'
import { toLocaleDateStringFactory } from './utils'

import type { IPropsTable } from '../../types'

const Index = (props: IPropsTable) => {
	const { rowHeight, rowWidth, tasks, fontFamily, fontSize, locale, onExpanderClick } = props
	const toLocaleDateString = useMemo(() => toLocaleDateStringFactory(locale), [locale])

	return (
		<div className={styles._local} style={{ fontFamily, fontSize }}>
			{tasks.map((item) => (
				<Row {...{ item, rowHeight, rowWidth, onExpanderClick, toLocaleDateString }} />
			))}
		</div>
	)
}

export default Index
