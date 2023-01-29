import clsx from 'clsx'
import { Fragment } from 'react'
import { When } from 'react-if'

import FlatContent from './components/FlatContent'
import FloatContentItem from './components/FloatContentItem'
import styles from './index.less'

import type { IPropsReference } from '../../types'

const Index = (props: IPropsReference) => {
	const { parent, namespace, id, reference, container } = props

	const props_flat_content = {
		parent,
		namespace,
		id,
		flatContent: reference?.flatContent
	}

	return (
		<Fragment>
			<When condition={!!reference?.flatContent}>
				<FlatContent {...props_flat_content}></FlatContent>
			</When>
			<When condition={!!reference?.floatContents?.length}>
				<div className={clsx([styles.float_contents_wrap, 'flex flex_column absolute'])}>
					{reference?.floatContents?.map((item) => (
						<FloatContentItem {...{ id, item, container }}></FloatContentItem>
					))}
				</div>
			</When>
		</Fragment>
	)
}

export default window.$app.memo(Index)
