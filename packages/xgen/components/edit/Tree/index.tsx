import { Tree } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Item } from '@/components'

import styles from './index.less'
import Model from './model'

import type { TreeProps } from 'antd'
import type { Component } from '@/types'

interface IProps extends TreeProps, Component.PropsEditComponent {}

interface CustomProps extends TreeProps {
	value: TreeProps['checkedKeys']
	onChange: (v: TreeProps['checkedKeys']) => void
}

const Custom = window.$app.memo((props: CustomProps) => {
	const [value, setValue] = useState<TreeProps['checkedKeys']>()

	useEffect(() => {
		if (!props.value) return

		setValue(props.value)
	}, [props.value])

	const onChange = (v: TreeProps['checkedKeys']) => {
		if (!props.onChange) return

		props.onChange(v)

		setValue(v)
	}

	return <Tree {...props} checkedKeys={value} onCheck={onChange}></Tree>
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.remote.raw_props = props

		x.remote.init()
	}, [props])

	return (
		<Item className={styles._local} {...itemProps} {...{ __bind, __name }}>
			{/* @ts-ignore */}
			<Custom {...rest_props} treeData={x.options} checkable></Custom>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
