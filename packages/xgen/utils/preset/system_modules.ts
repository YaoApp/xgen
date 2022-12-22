import React from 'react'
import ReactDom from 'react-dom'
import ReactDomClient from 'react-dom/client'
import JsxRuntime from 'react/jsx-runtime'

System.set('app:react', { default: React, __useDefault: true })
System.set('app:react/jsx-runtime', { ...JsxRuntime })
System.set('app:react-dom', { default: ReactDom, __useDefault: true })
System.set('app:react-dom/client', { default: ReactDomClient, __useDefault: true })

System.addImportMap({
	imports: {
		react: 'app:react',
		'react/jsx-runtime': 'app:react/jsx-runtime',
		'react-dom': 'app:react-dom',
		'react-dom/client': 'app:react-dom/client'
	}
})
