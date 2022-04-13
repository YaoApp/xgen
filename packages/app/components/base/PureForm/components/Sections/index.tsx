import clsx from 'clsx'

import Section from '../Section'
import styles from './index.less'

import type { IPropsSections } from '../../types'

const Index = (props: IPropsSections) => {
      const { sections } = props
      
      return null

	return (
		<div className={clsx([styles._local, 'w_100 border_box flex flex_column'])}>
			{sections.map((item, index) => (
				<Section item={item} key={index}></Section>
			))}
		</div>
	)
}

export default window.$app.memo(Index)
