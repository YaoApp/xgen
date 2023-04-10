import 'systemjs/dist/extras/amd'
import 'systemjs/dist/extras/use-default'

import {
	useAsyncEffect,
	useClickAway,
	useDeepCompareEffect,
	useFullscreen,
	useKeyPress,
	useMemoizedFn,
	useMount,
	useSize,
	useToggle
} from 'ahooks'
import { Form, Input } from 'antd'
import { deepEqual } from 'fast-equals'
import { autorun, configure, makeAutoObservable, reaction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as ReactDomClient from 'react-dom/client'
import * as JsxRuntime from 'react/jsx-runtime'
import { createMakeAndWithStyles } from 'tss-react'
import { container, injectable, singleton } from 'tsyringe'

import { Graph, Markup } from '@antv/x6'
import { register } from '@antv/x6-react-shape'

System.set('app:react', { default: React, ...React })
System.set('app:react-dom', { default: ReactDom, ...ReactDom })
System.set('app:react-dom/client', { default: ReactDomClient, ...ReactDomClient })
System.set('app:react/jsx-runtime', { ...JsxRuntime })

System.set('app:tss-react', { createMakeAndWithStyles })
System.set('app:fast-equals', { deepEqual })

System.set('app:tsyringe', { container, injectable, singleton })
System.set('app:mobx', { toJS, makeAutoObservable, reaction, autorun, configure })
System.set('app:mobx-react-lite', { observer })

System.set('app:@antv/x6', { Graph, Markup })
System.set('app:@antv/x6-react-shape', { register })

System.set('app:antd', { Input, Form })
System.set('app:ahooks', {
	useMemoizedFn,
	useClickAway,
	useFullscreen,
	useToggle,
	useMount,
	useDeepCompareEffect,
	useKeyPress,
	useAsyncEffect,
	useSize
})

System.addImportMap({
	imports: {
		[`react`]: 'app:react',
		[`react-dom`]: 'app:react-dom',
		[`react-dom/client`]: 'app:react-dom/client',
		[`react/jsx-runtime`]: 'app:react/jsx-runtime',

		[`tss-react`]: 'app:tss-react',
		[`fast-equals`]: 'app:fast-equals',

		[`tsyringe`]: 'app:tsyringe',
		[`mobx`]: 'app:mobx',
		[`mobx-react-lite`]: 'app:mobx-react-lite',

		[`@antv/x6`]: 'app:@antv/x6',
		[`@antv/x6-react-shape`]: 'app:@antv/x6-react-shape',

		[`antd`]: 'app:antd',
		[`ahooks`]: 'app:ahooks'
	}
})
