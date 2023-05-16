import { useAsyncEffect } from 'ahooks'
import clsx from 'clsx'
import { Fragment, useState } from 'react'
import * as JsxRuntime from 'react/jsx-runtime'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'

import { compile, run } from '@mdx-js/mdx'
import { useMDXComponents } from '@mdx-js/react'

import components from './components'
import styles from './index.less'

interface IProps {
	source: string
	callback?: () => void
}

const Index = (props: IProps) => {
	const { source, callback } = props
	const [target, setTarget] = useState<any>()
	const mdx_components = useMDXComponents(components)

	useAsyncEffect(async () => {
		const compiled_source = await compile(source, {
			format: 'mdx',
			outputFormat: 'function-body',
			providerImportSource: '#',
			remarkPlugins: [remarkGfm],
			rehypePlugins: [
				() => (tree) => {
                              visit(tree, (node) => {
                                    if (node?.type === 'text' && node?.value === '\n') {
                                          node.type='element'
                                          node.tagName='p'
                                          node.properties={className:'_newline'}
                                    }

						if (node?.type === 'element' && node?.tagName === 'pre') {
							const [codeEl] = node.children

							if (codeEl.tagName !== 'code') return

							node.raw = codeEl.children?.[0].value
						}
					})
				},
				rehypeHighlight,
				() => (tree) => {
                              visit(tree, (node) => {
						if (node?.type === 'element' && node?.tagName === 'pre') {
							for (const child of node.children) {
								if (child.tagName === 'code') {
									child.properties['raw'] = node.raw
								}
							}
						}
					})
				}
			]
		})

		const { default: Content } = await run(compiled_source, {
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
