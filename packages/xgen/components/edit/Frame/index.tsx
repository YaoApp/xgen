import { Input } from 'antd'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'
import { local, session } from '@yaoapp/storex'

import type { InputProps } from 'antd'
import type { App, Component } from '@/types'
import { Else, If, Then } from 'react-if'
import { useEffect, useRef, useState } from 'react'

interface IFrameIProps {
	url?: string
	params?: Record<string, string>
	height?: string
	width?: string
	data?: Record<string, any>

	__value: any // initial value
	value: any
	disabled?: boolean

	label?: string
	bind?: string
	namespace?: string
	type?: string
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, IFrameIProps {
	ai?: { placeholder?: string }
}

const Frame = window.$app.memo((props: IFrameIProps) => {
	const { bind, label, namespace, type, disabled } = props
	const [value, setValue] = useState(props.value || props.__value)
	const ref = useRef<HTMLIFrameElement>(null)
	const getToken = (): string => {
		const is_session_token = local.token_storage === 'sessionStorage'
		const token = is_session_token ? session.token : local.token
		return token || ''
	}

	const getTheme = (): App.Theme => {
		const theme = (local.xgen_theme || 'light') as App.Theme
		return theme
	}

	const parseUrl = (url: string, params?: Record<string, string>, data?: Record<string, any>) => {
		if (url == '') return ''

		const token = getToken()
		const new_url = url.replace(/{{\s*([^}]+)\s*}}/gi, (match, p1) => {
			p1 = p1.trim()
			return data?.[p1] || ''
		})
		const new_params = new URLSearchParams()
		for (const key in params) {
			const value = params[key]
			new_params.append(
				key,
				value.replace(/\[\[\s*([^}]+)\s*\]\]/gi, (match, p1) => {
					p1 = p1.trim()
					return data?.[p1] || ''
				})
			)
		}
		new_params.append('__token', token)
		new_params.append('__locale', getLocale())
		new_params.append('__theme', getTheme())
		new_params.append('__value', value || '')
		new_params.append('__bind', bind || '')
		new_params.append('__label', label || '')
		new_params.append('__namespace', namespace || '')
		new_params.append('__type', type || '')
		new_params.append('__disabled', disabled ? 'true' : 'false')
		return `${new_url}?${new_params.toString()}`
	}

	// Generate url
	let url = ''
	try {
		url = parseUrl(props.url || '', props.params, props.data || {})
	} catch (error) {
		console.error('parseUrl error', error)
	}

	// Add event listener to receive message from iframe
	useEffect(() => {
		// Receive message from iframe
		const message = (e: MessageEvent) => {
			const data = e.data || {}
			const { type, value, bind, namespace } = data
			if (type === 'change' && bind === bind && namespace === namespace) {
				setValue(value)
				props.onChange?.(value)
				return
			}

			if (type === 'resize' && bind === bind && namespace === namespace) {
				const { height, width } = value
				if (!ref.current) {
					return
				}

				if (height) ref.current.style.height = height
				if (width) ref.current.style.width = width
			}
		}

		window.addEventListener('message', message)
		return () => window.removeEventListener('message', message)
	}, [])

	return (
		<If condition={url != ''}>
			<Then>
				<iframe
					ref={ref}
					className='w_100'
					src={url}
					style={{
						background: 'none',
						height: props.height || '100%',
						border: 'none',
						width: props.width || '100%'
					}}
				></iframe>
			</Then>
			<Else>
				<div className='w_100 border_box flex justify_center align_center'>No content</div>
			</Else>
		</If>
	)
})

const Index = (props: IProps) => {
	const { __bind, __namespace, __name, __type, itemProps, ...rest_props } = props
	return (
		<Item {...itemProps} {...{ __bind, __name }} noStyle>
			<Frame {...rest_props} namespace={__namespace} bind={__bind} label={__name} type={__type}></Frame>
		</Item>
	)
}

export default window.$app.memo(Index)
