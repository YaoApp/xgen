import { useEventTarget, useKeyPress, useMemoizedFn } from 'ahooks'
import { Input, Button, Popover } from 'antd'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { ChatCircleText, PaperPlaneTilt, X, ArrowsOutSimple, ArrowsInSimple, Stop } from 'phosphor-react'
import { useLayoutEffect, useEffect, useRef, useState, useMemo } from 'react'
import { Else, If, Then } from 'react-if'

import { fuzzyQuery } from '@/knife'
import { useLocation, getLocale } from '@umijs/max'
import { local } from '@yaoapp/storex'

import { ChatItem } from '../components'
import { useEventStream } from '../hooks'
import styles from './index.less'

import type { IPropsNeo } from '../../../types'
import type { App, Common } from '@/types'

const { TextArea } = Input

const Index = (props: IPropsNeo) => {
	const { stack, api, studio, dock } = props
	return <div>Float Neo</div>
}

export default window.$app.memo(Index)
