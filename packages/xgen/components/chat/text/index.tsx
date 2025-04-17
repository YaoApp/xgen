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
import Mermaid from './Mermaid'
import Think from '../think'
import Tool from '../tool'
import type { Component } from '@/types'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

interface IProps extends Component.PropsChatComponent {
	chat_id: string
	text: string
	done?: boolean
}

const components = (chat_id: string, done?: boolean) => {
	return {
		code: function (props: any) {
			if (props?.className?.includes('language-mermaid')) {
				const chart = props.raw || props.children || ''
				// 预处理 Mermaid 内容
				const processedChart = chart
					.split('\n')
					.map((line: string) => {
						// 处理节点定义行
						if (line.includes('[') && line.includes(']')) {
							return line.replace(/\[([^\]]+)\]/g, (match, content) => {
								// 如果内容已经被引号包裹，则不再添加引号
								if (content.startsWith('"') && content.endsWith('"')) {
									return `[${content}]`
								}
								return `["${content}"]`
							})
						}
						return line
					})
					.filter(Boolean) // 移除空行
					.join('\n')
					.trim()

				return <Mermaid chart={processedChart} chat_id={chat_id} />
			}
			return <Code {...props} chat_id={chat_id} />
		},
		Think: function (props: any) {
			const { pending = 'false' } = props
			const pendingBool = pending == 'true'
			const id = props.id || ''
			const begin = props.begin || 0
			const end = props.end || 0
			return (
				<Think pending={pendingBool} chat_id={chat_id} id={id} begin={begin} end={end} done={done}>
					{props.children || 'Thinking...'}
				</Think>
			)
		},
		Tool: function (props: any) {
			const { pending = 'false' } = props
			const pendingBool = pending == 'true'
			const id = props.id || ''
			const begin = props.begin || 0
			const end = props.end || 0
			return (
				<Tool pending={pendingBool} chat_id={chat_id} id={id} begin={begin} end={end} done={done}>
					{props.children || 'Calling...'}
				</Tool>
			)
		}
	}
}

const escape = (text?: string) => {
	return text
		?.replace(
			/\|([^|\n]*[<>][^|\n]*)\|/g,
			(_, content) => `|${content.replace(/[<>]/g, (match: string) => (match === '<' ? '&lt;' : '&gt;'))}|`
		)
		.replace(/\r/g, '') // remove \r
		.replace(/\{/g, '\\{')
		.replace(/\}/g, '\\}')
		.replace(/\$\$[\n\r]+/g, '$$\n')
		.replace(/[\n\r]+\$\$/g, '\n$$')
}

const unescape = (text?: string) => {
	return text?.replace(/\\{/g, '{').replace(/\\}/g, '}')
}

const Index = (props: IProps) => {
	const { text, chat_id, done } = props
	const [content, setContent] = useState<any>('')
	const mdxComponents = useMDXComponents(components(chat_id, done))
	useAsyncEffect(async () => {
		const vfile = new VFile(escape(text))
		const [err, compiledSource] = await to(
			compile(vfile, {
				format: 'mdx',
				outputFormat: 'function-body',
				providerImportSource: '@mdx-js/react',
				development: false,
				remarkPlugins: [remarkGfm, [remarkMath, { strict: true }]],
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
								node.raw = unescape(codeEl.children?.[0].value)
							}

							// if (node?.type === 'element' && ['Think', 'Tool'].includes(node?.tagName)) {
							// 	node.properties = Object.entries(node.properties || {}).reduce<
							// 		Record<string, any>
							// 	>((acc, [key, value]) => {
							// 		if (key === 'pending' && typeof value === 'string') {
							// 			acc[key] = value === 'true'
							// 		} else {
							// 			acc[key] = value
							// 		}
							// 		return acc
							// 	}, {})
							// }
						})
					},
					// Replace \{ => { and \} => }
					() => (tree) => {
						visit(tree, (node) => {
							if (node?.type === 'text') {
								node.value = unescape(node.value)
							}
						})
					},
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
					},
					[rehypeKatex, { output: 'mathml', strict: true, throwOnError: false }],
					rehypeHighlight.bind(null, { ignoreMissing: true }),

					() => (tree) => {
						visit(tree, (node) => {
							// Handle mermaid code blocks
							if (
								node?.type === 'element' &&
								node?.tagName === 'code' &&
								node?.properties?.className?.includes('language-mermaid')
							) {
								node.properties.raw = unescape(node.children?.[0]?.value)
							}
						})
					}
				]
			})
		)

		if (err) {
			console.error(`parse mdx error: ${err.message || err}`)
			console.log(`original text:\n`, text)
			return
		}

		if (!compiledSource) return

		try {
			const { default: Content } = await run(compiledSource, {
				...JsxRuntime,
				Fragment,
				useMDXComponents: () => mdxComponents,
				chat_id
			})
			setContent(Content)
		} catch (err) {
			console.error(`run mdx error: ${err}`)
			console.log(`original text:\n`, text)
		}
	}, [text, chat_id, done])

	return <div className={styles._local}>{content}</div>
}

export default window.$app.memo(Index)
