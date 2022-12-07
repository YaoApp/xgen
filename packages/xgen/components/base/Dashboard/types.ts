import type { Dashboard } from '@/types'

export interface IPropsItem {
	item: Dashboard.TargetColumn
}

export interface IPropsChartRender{
	item: Dashboard.TargetColumnNormal
}

export interface IPropsTableRender{
	item: Dashboard.TargetColumnNormal
}

export interface IPropsFormRender{
	item: Dashboard.TargetColumnNormal
}

