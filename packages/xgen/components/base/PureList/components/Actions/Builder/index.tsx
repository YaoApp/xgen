import { Button } from 'antd'
import clsx from 'clsx'
import { CaretDown, CaretLeft, DotsSixVertical, GitMerge, Plus, X } from 'phosphor-react'
import { Else, If, Then, When } from 'react-if'

import styles from './index.lsss'

import type { IPropsActions } from '../../../types'

const Index = (props: IPropsActions) => {
	const { hasChildren, parentIds, fold, showFoldAction, onAction } = props
	return (
		<div
			className={clsx([
				'actions_wrap_builder border_box flex justify_between',
				hasChildren && 'hasChildren'
			])}
			style={{ alignItems: 'center' }}
		>
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
							<CaretLeft size={16} weight='bold'></CaretLeft>
						</Then>
						<Else>
							<CaretDown size={16} weight='bold'></CaretDown>
						</Else>
					</If>
				</Button>
			</When>
			<Plus size={14} weight='bold' onClick={() => onAction('add', parentIds)}></Plus>
			<When condition={hasChildren}>
				<GitMerge size={14} weight='bold' onClick={() => onAction('addChild', parentIds)}></GitMerge>
			</When>
			<X size={14} weight='bold' onClick={() => onAction('remove', parentIds)}></X>
			<DotsSixVertical className='handle  clickable' size={16} weight='bold'></DotsSixVertical>
		</div>
	)
}

export default window.$app.memo(Index)
