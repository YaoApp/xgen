import clsx from 'clsx'

import Section from '../Section'
import styles from './index.less'

import type { IPropsSections, IPropsSection } from '../../types'

const Index = (props: IPropsSections) => {
	const { namespace, primary, data, sections, disabled } = props

	const props_section: Omit<IPropsSection, 'item'> = {
		namespace,
		primary,
		data,
		disabled
	}

	return (
		<div className={clsx([styles._local, 'w_100 border_box flex flex_column'])}>
			{sections.map((item, index) => (
				<Section {...props_section} item={item} key={index}></Section>
			))}
		</div>
	)
}

export default window.$app.memo(Index)
