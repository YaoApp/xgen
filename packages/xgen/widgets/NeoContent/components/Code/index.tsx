import { useMemoizedFn } from 'ahooks'
import clsx from 'clsx'
import { Copy } from 'phosphor-react'
import { useState } from 'react'
import { When, If, Then, Else } from 'react-if'

import { getLocale } from '@umijs/max'

import styles from './index.less'

import type { FC } from 'react'

interface IProps {
	className?: string
	children?: any
	raw?: string
}

const Index: FC<IProps> = (props) => {
	const { className, children, raw } = props
	const [copied, setCopied] = useState(false)
	const is_cn = getLocale() === 'zh-CN'

	const copy = useMemoizedFn(async () => {
		if (!raw) return

		await navigator.clipboard.writeText(raw)

		setCopied(true)

		setTimeout(() => setCopied(false), 3000)
	})

	if (!className) return <code className={styles.inline}>{children}</code>

	return (
		<code className={clsx('w_100 flex flex_column', className, styles._local)}>
			<When condition={className && raw}>
				<div className='code_header_wrap w_100 border_box flex justify_between align_center'>
					<span className='lang'>{className?.replace('hljs language-', '')}</span>
					<If condition={copied}>
						<Then>{is_cn ? '已复制' : 'copied'}</Then>
						<Else>
							<div
								className='btn_copy flex justify_center align_center clickable'
								onClick={copy}
							>
								<Copy size={16}></Copy>
							</div>
						</Else>
					</If>
				</div>
			</When>
			<div className='code_content_wrap w_100 border_box'>{children}</div>
		</code>
	)
}

export default window.$app.memo(Index)
