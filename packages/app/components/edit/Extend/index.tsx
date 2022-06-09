import axios from 'axios'
import Mustache from 'mustache'
import { Fragment, useEffect, useState } from 'react'

import styles from './index.less'

import type { Component } from '@/types'

interface IProps extends Component.PropsEditComponent {
	link: string
	maxHeight: number
	useJs?: boolean
}

const Index = (props: IProps) => {
	const { __data_item, link, maxHeight, useJs } = props
	const [css, setCss] = useState('')
	const [html, setHtml] = useState('')

	const getCss = async () => {
		const css = await axios.get<{}, any>(`${link}/index.css`)

		setCss(css)
	}

	const getHTML = async () => {
		const html = await axios.get<{}, any>(`${link}/index.html`)

		setHtml(html)
	}

	useEffect(() => {
		getCss()
		getHTML()
	}, [props])

	useEffect(() => {
		if (!html) return
		if (!useJs) return

		const script = document.createElement('script')

		script.type = 'text/javascript'
		script.src = `${link}/index.js`

		document.body.appendChild(script)
	}, [html, useJs])

	return (
		<Fragment>
			<style>{css}</style>
			<div
				className={styles._local}
				dangerouslySetInnerHTML={{ __html: Mustache.render(html, __data_item) }}
				style={{ maxHeight }}
			></div>
		</Fragment>
	)
}

export default window.$app.memo(Index)
