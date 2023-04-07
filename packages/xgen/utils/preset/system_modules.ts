import 'systemjs/dist/extras/amd'
import 'systemjs/dist/extras/use-default'

import { Form, Input } from 'antd'
import { deepEqual } from 'fast-equals'
import * as Mobx from 'mobx'
import * as MobxReactLite from 'mobx-react-lite'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as ReactDomClient from 'react-dom/client'
import JsxRuntime from 'react/jsx-runtime'
import { createMakeAndWithStyles } from 'tss-react'
import * as Tsyringe from 'tsyringe'

import { Graph } from '@antv/x6'
import { register } from '@antv/x6-react-shape'

System.set('app:tss-react', { createMakeAndWithStyles })
System.set('app:@antv/x6', { Graph })
System.set('app:@antv/x6-react-shape', { register })
System.set('app:antd', { Input, Form })
System.set('app:fast-equals', { deepEqual })
System.set('app:tsyringe', { ...Tsyringe })
System.set('app:mobx', { ...Mobx })
System.set('app:mobx-react-lite', { ...MobxReactLite })
System.set('app:react/jsx-runtime', { ...JsxRuntime })
System.set('app:react', { default: React, ...React })
System.set('app:react-dom', { default: ReactDom, ...ReactDom })
System.set('app:react-dom/client', { default: ReactDomClient, ...ReactDomClient })

System.addImportMap({
	imports: {
		'tss-react': 'app:tss-react',
		'@antv/x6': 'app:@antv/x6',
		'@antv/x6-react-shape': 'app:@antv/x6-react-shape',
		antd: 'app:antd',
		tsyringe: 'app:tsyringe',
		mobx: 'app:mobx',
		react: 'app:react',
		'fast-equals': 'app:fast-equals',
		'mobx-react-lite': 'app:mobx-react-lite',
		'react/jsx-runtime': 'app:react/jsx-runtime',
		'react-dom': 'app:react-dom',
		'react-dom/client': 'app:react-dom/client'
	}
})
