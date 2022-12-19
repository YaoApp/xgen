import type { Dashboard, Global } from '@/types'

export interface IPropsItem {
      item: Dashboard.TargetColumn
	data: Global.AnyObject
}

export interface IPropsChartRender {
	item: Dashboard.TargetColumnNormal
	data: Global.AnyObject
}

export interface IPropsTableRender {
	item: Dashboard.TargetColumnNormal
}

export interface IPropsFormRender {
	item: Dashboard.TargetColumnNormal
}
