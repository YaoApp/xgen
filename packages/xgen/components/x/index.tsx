import { message } from 'antd'
import { lazy, Suspense, useEffect, useMemo } from 'react'

import type { Global } from '@/types'
import { ExportComponents } from '@/components/exports' // Import the components for shadow dom and dynamic import

type ComponentsType = 'base' | 'edit' | 'view' | 'chart' | 'group' | 'optional'

interface IProps {
	type: ComponentsType
	name: string
	props: Global.AnyObject

	/**
	 * if the component in the shadow dom, the value is the shadow dom name
	 *
	 * name rules:
	 * 	1. The name of the shadow dom is the same as the component name
	 *  2. Must be lowercase, CamelCase should be converted to <kebab-case>
	 *
	 * example:
	 * 	1. Modal => modal
	 * 	2. PureList => pure-list
	 *  3. PureTable => pure-table
	 *  4. PureChart => pure-chart
	 *
	 * 	@see /components/base/PureList/components/FormItem/index.tsx
	 */
	__shadow?: string

	/**
	 * the shadow dom host ref, only for shadow dom
	 *
	 * example:
	 * 	@see /components/base/PureList/components/index.tsx
	 * 	@see /components/base/PureList/components/FormItem/index.tsx
	 */
	__shadow_host_ref?: React.RefObject<HTMLDivElement>
}

const Index = ({ type, name, props, __shadow, __shadow_host_ref }: IProps) => {
	// Import the component styles for shadow dom
	const importStyles = () => {
		if (!__shadow_host_ref || !__shadow_host_ref.current || !__shadow_host_ref.current.shadowRoot) return
		const component_name = `xgen-component-${type}__${name}`

		// Check if the styles are already loaded
		if (__shadow_host_ref.current.getAttribute(component_name) === 'true') {
			return
		}

		// Load the styles for the component
		__shadow_host_ref.current.setAttribute(component_name, 'true')
		const style = document.createElement('style')
		style.id = component_name
		import(`@/public/components/${type}/${name}/index.sss`)
			.then((module) => {
				style.innerHTML = module.default || ''
				const themeStyle = __shadow_host_ref?.current?.shadowRoot?.querySelector('#xgen-theme')
				if (themeStyle) {
					themeStyle.after(style)
					return
				}
			})
			.catch(() => {})
	}
	__shadow && ExportComponents[`${type}/${name}`] && useEffect(() => importStyles(), [__shadow_host_ref])

	// Dynamically import the component
	const Component = useMemo(() => {
		if (name.startsWith('public/')) {
			const { origin } = window.location
			const component_name = name.replace('public/', '')
			return lazy(() =>
				// @ts-ignore
				System.import(`${origin}/components/${component_name}.js`).catch(() => {
					message.error(`Component is not exist, type:'${type}' name:'${name}'`)
					console.error(`Component is not exist, type:'${type}' name:'${name}'`, props)
				})
			)
		}

		return lazy(() => {
			const component = import(`@/components/${type}/${name}`).catch(() => {
				message.error(`Component is not exist, type:'${type}' name:'${name}'`)
				console.error(`Component is not exist, type:'${type}' name:'${name}'`, props)
				return { default: () => null }
			})
			return component
		})
	}, [type, name])

	return (
		<Suspense fallback={null}>
			<Component __shadow={__shadow} {...props} />
		</Suspense>
	)
}

export default window.$app.memo(Index)
