import { Button } from 'antd'
import clsx from 'clsx'
import { CaretDown, CaretLeft, DotsSixVertical, GitMerge, Plus, X } from 'phosphor-react'
import { Else, If, Then, When } from 'react-if'

import styles from './index.lsss'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const { hasChildren, parentIds, fold, showFoldAction, onAction } = props

	return (
		<div className={clsx(['actions_wrap border_box flex justify_between', hasChildren && 'hasChildren'])}>
			<style>{styles}</style>
			<When condition={hasChildren}>
				<Button
					className={clsx([
						'btn_action flex justify_center align_center clickable',
						!showFoldAction && 'disabled'
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
			</When>
			<Button
				className='btn_action flex justify_center align_center clickable'
				onClick={() => onAction('add', parentIds)}
			>
				<Plus size={18} weight='bold'></Plus>
			</Button>
			<When condition={hasChildren}>
				<Button
					className='btn_action flex justify_center align_center clickable'
					onClick={() => onAction('addChild', parentIds)}
				>
					<GitMerge size={18} weight='bold'></GitMerge>
				</Button>
			</When>
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
