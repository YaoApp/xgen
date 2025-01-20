import { useAsyncEffect } from 'ahooks'
import to from 'await-to-js'
import { Fragment, useState } from 'react'
import * as JsxRuntime from 'react/jsx-runtime'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import { VFile } from 'vfile'
import { compile, run } from '@mdx-js/mdx'
import { useMDXComponents } from '@mdx-js/react'
import styles from './index.less'
import Code from './Code'
import type { Component } from '@/types'

interface IProps extends Component.PropsChatComponent {
	id?: string
	text: string
}

const components = {
	code: Code
}

const Index = (props: IProps) => {
	const { text } = props
	const [content, setContent] = useState<any>()
	const mdxComponents = useMDXComponents(components)

	useAsyncEffect(async () => {
		const vfile = new VFile(text)
		const [err, compiledSource] = await to(
			compile(vfile, {
				format: 'md',
				outputFormat: 'function-body',
				providerImportSource: '@mdx-js/react',
				remarkPlugins: [remarkGfm],
				rehypePlugins: [
					() => (tree) => {
						visit(tree, (node) => {
							if (node?.type === 'text' && node?.value === '\n') {
								node.type = 'element'
								node.tagName = 'p'
								node.properties = { className: '_newline' }
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
		)

		if (err) {
			setContent(<div className={'error'}>{err.message}</div>)
			return
		}

		if (!compiledSource) return
		compiledSource.value = (compiledSource.value as string).replaceAll('%7B', '{')

		const { default: Content } = await run(compiledSource, {
			...JsxRuntime,
			Fragment,
			useMDXComponents: () => mdxComponents
		})

		setContent(Content)
	}, [text])

	return <div className={styles._local}>{content}</div>
}

export default window.$app.memo(Index)
