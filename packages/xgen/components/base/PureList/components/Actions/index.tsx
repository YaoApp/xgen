import { Button } from 'antd'
import clsx from 'clsx'
import { CaretDown, CaretLeft, DotsSixVertical, GitMerge, Plus, X } from 'phosphor-react'
import { Else, If, Then } from 'react-if'

import styles from './index.lsss'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const { parentIds, fold, hasChildren, onAction } = props

	return (
		<div className='actions_wrap border_box flex justify_between'>
			<style>{styles}</style>
			<Button
				className={clsx([
					'btn_action flex justify_center align_center clickable',
					!hasChildren && 'disabled'
				])}
				onClick={() => onAction('fold', parentIds)}
			>
				<If condition={fold}>
					<Then>
						<CaretLeft size={18} weight='bold'></CaretLeft>
					</Then>
					<Else>
						<CaretDown size={18} weight='bold'></CaretDown>
					</Else>
				</If>
			</Button>
			<Button
				className='btn_action flex justify_center align_center clickable'
				onClick={() => onAction('add', parentIds)}
			>
				<Plus size={18} weight='bold'></Plus>
			</Button>
			<Button
				className='btn_action flex justify_center align_center clickable'
				onClick={() => onAction('addChild', parentIds)}
			>
				<GitMerge size={18} weight='bold'></GitMerge>
			</Button>
			<Button
				className='btn_action flex justify_center align_center clickable'
				onClick={() => onAction('remove', parentIds)}
			>
				<X size={18} weight='bold'></X>
			</Button>
			<Button className='handle btn_action flex justify_center align_center clickable'>
				<DotsSixVertical size={24} weight='bold'></DotsSixVertical>
			</Button>
		</div>
	)
}

export default window.$app.memo(Index)
