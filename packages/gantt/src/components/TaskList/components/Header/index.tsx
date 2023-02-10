import styles from './index.css'

import type { IPropsHeader } from '../../types'

const Index = (props: IPropsHeader) => {
	const { headerHeight, fontFamily, fontSize, rowWidth } = props

	return (
		<div className={styles._local} style={{ fontFamily, fontSize }}>
			<div className='ganttTable_Header' style={{ height: headerHeight - 2 }}>
				<div className='ganttTable_HeaderItem' style={{ minWidth: rowWidth }}>
					&nbsp;Name
				</div>
				<div
					className='ganttTable_HeaderSeparator'
					style={{ height: headerHeight * 0.5, marginTop: headerHeight * 0.2 }}
				/>
				<div className='ganttTable_HeaderItem' style={{ minWidth: rowWidth }}>
					&nbsp;From
				</div>
				<div
					className='ganttTable_HeaderSeparator'
					style={{ height: headerHeight * 0.5, marginTop: headerHeight * 0.25 }}
				/>
				<div className='ganttTable_HeaderItem' style={{ minWidth: rowWidth }}>
					&nbsp;To
				</div>
			</div>
		</div>
	)
}

export default Index
