import type { Component } from '@/types'
import { Else, If, Then } from 'react-if'
import { local, session } from '@yaoapp/storex'
import { getLocale } from '@umijs/max'

interface IProps {
	url?: string
	params?: Record<string, string>
	height?: string
	width?: string
	data?: Record<string, any>
}

const Index = (props: IProps) => {
	const getToken = (): string => {
		const is_session_token = local.token_storage === 'sessionStorage'
		const token = is_session_token ? session.token : local.token
		return token || ''
	}

	const parseUrl = (url: string, params?: Record<string, string>, data?: Record<string, any>) => {
		if (url == '') return ''

		const token = getToken()
		if (data) {
			data['__token'] = token
			data['__locale'] = getLocale()
		}

		const new_url = url.replace(/{{\s*([^}]+)\s*}}/gi, (match, p1) => {
			p1 = p1.trim()
			return data?.[p1] || ''
		})
		const new_params = new URLSearchParams()
		for (const key in params) {
			const value = params[key]
			new_params.append(
				key,
				value.replace(/{{\s*([^}]+)\s*}}/gi, (match, p1) => {
					p1 = p1.trim()
					return data?.[p1] || ''
				})
			)
		}
		return `${new_url}?${new_params.toString()}`
	}

	let url = ''
	try {
		url = parseUrl(props.url || '', props.params, props.data)
	} catch (error) {
		console.error('parseUrl error', error)
	}
	return (
		<If condition={url != ''}>
			<Then>
				<iframe
					className='w_100 border_box'
					src={url}
					style={{ height: props.height || '100%', border: 'none', width: props.width || '100%' }}
				></iframe>
			</Then>
			<Else>
				<div className='w_100 border_box flex justify_center align_center'>No content</div>
			</Else>
		</If>
	)
}

export default window.$app.memo(Index)
