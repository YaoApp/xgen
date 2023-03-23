import { useAsyncEffect } from 'ahooks'
import clsx from 'clsx'
import { Fragment, useState } from 'react'
import JsxRuntime from 'react/jsx-runtime'

import { evaluate } from '@mdx-js/mdx'
import { useMDXComponents } from '@mdx-js/react'

import components from './components'
import styles from './index.less'

interface IProps {
	source?: string
	callback?: () => void
}

const Index = (props: IProps) => {
	const { source = `<Test>world</Test>`, callback } = props
	const [target, setTarget] = useState<any>()
	const mdx_components = useMDXComponents(components)

	useAsyncEffect(async () => {
		const { default: Content } = await evaluate(source, {
			...JsxRuntime,
			Fragment,
			useMDXComponents: () => mdx_components
		})

		setTarget(Content)
		callback?.()
	}, [source])

	return <div className={clsx(styles._local)}>{target}</div>
}

export default window.$app.memo(Index)
