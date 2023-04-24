import 'systemjs/dist/extras/amd'
import 'systemjs/dist/extras/use-default'

import {
	useAsyncEffect,
	useClickAway,
	useDeepCompareEffect,
	useDynamicList,
	useFullscreen,
	useKeyPress,
	useMemoizedFn,
	useMount,
	useSize,
	useToggle,
	useUpdateEffect
} from 'ahooks'
import {
	Button,
	Checkbox,
	ConfigProvider,
	Drawer,
	Form,
	Input,
	InputNumber,
	Popover,
	Radio,
	Select,
	Table,
	Tooltip
} from 'antd'
import to from 'await-to-js'
import axios from 'axios'
import { cx } from 'classix'
import Emittery from 'emittery'
import { deepEqual } from 'fast-equals'
import { autorun, configure, makeAutoObservable, reaction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as ReactDomClient from 'react-dom/client'
import root from 'react-shadow'
import * as JsxRuntime from 'react/jsx-runtime'
import { match, P } from 'ts-pattern'
import { createMakeAndWithStyles } from 'tss-react'
import { container, injectable, singleton } from 'tsyringe'

import { DagreLayout } from '@antv/layout'
import { Graph, Markup } from '@antv/x6'
import { Scroller } from '@antv/x6-plugin-scroller'
import { Portal, register } from '@antv/x6-react-shape'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { local, session } from '@yaoapp/storex'

const import_maps = {
	['react']: {
		default: React,
		...React
	},
	['react-dom']: {
		default: ReactDom,
		...ReactDom
	},
	['react-dom/client']: {
		default: ReactDomClient,
		...ReactDomClient
	},
	['react/jsx-runtime']: {
		...JsxRuntime
	},

	['react-shadow']: {
		default: root
	},
	['await-to-js']: {
		default: to
	},
	['ts-pattern']: {
		match,
		P
	},
	['axios']: {
		default: axios
	},
	['emittery']: {
		default: Emittery
	},
	['nanoid']: {
		nanoid
	},
	['classix']: {
		cx
	},
	['tss-react']: {
		createMakeAndWithStyles
	},
	['fast-equals']: {
		deepEqual
	},

	['tsyringe']: {
		container,
		injectable,
		singleton
	},
	['mobx']: {
		toJS,
		makeAutoObservable,
		reaction,
		autorun,
		configure
	},
	['mobx-react-lite']: {
		observer
	},

	['@antv/x6']: {
		Graph,
		Markup
	},
	['@antv/x6-react-shape']: {
		register,
		Portal
	},
	['@antv/x6-plugin-scroller']: {
		Scroller
	},
	['@antv/layout']: {
		DagreLayout
	},

	['@dnd-kit/core']: {
		DndContext,
		DragOverlay,
		PointerSensor,
		useSensor,
		useSensors
	},
	['@dnd-kit/sortable']: {
		SortableContext,
		useSortable,
		verticalListSortingStrategy,
		rectSortingStrategy,
		arrayMove
	},
	['@dnd-kit/utilities']: {
		CSS
	},

	['antd']: {
		ConfigProvider,
		Input,
		Form,
		Drawer,
		Popover,
		Button,
		Select,
		Table,
		Checkbox,
		Radio,
		InputNumber,
		Tooltip
	},
	['ahooks']: {
		useMemoizedFn,
		useClickAway,
		useFullscreen,
		useToggle,
		useMount,
		useDeepCompareEffect,
		useKeyPress,
		useAsyncEffect,
		useSize,
		useUpdateEffect,
		useDynamicList
	},

	['@yaoapp/storex']: {
		local,
		session
	}
} as Record<string, System.Module>

const imports = Object.keys(import_maps).reduce((total, key) => {
	const module_key = `app:${key}`

	System.set(module_key, import_maps[key])

	total[key] = module_key

	return total
}, {} as Record<string, string>)

System.addImportMap({ imports })
