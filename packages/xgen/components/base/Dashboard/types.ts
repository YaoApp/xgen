import type { Dashboard, Global } from '@/types'
import type Model from './model'

export interface IPropsItem {
	item: Dashboard.TargetColumn
	data: Global.AnyObject
	namespace: Model['namespace']['value']
}

export interface IPropsChartRender {
	item: Dashboard.TargetColumnNormal
	data: Global.AnyObject
}

export interface IPropsTableRender {
	item: Dashboard.TargetColumnNormal
	namespace: IPropsItem['namespace']
}

export interface IPropsFormRender {
	item: Dashboard.TargetColumnNormal
}

export interface IPropsViewRender {
	item: Dashboard.TargetColumnNormal
	data: Global.AnyObject
}

export interface IPropsFrameRender {
	item: Dashboard.TargetColumnNormal
	data: Global.AnyObject
}
