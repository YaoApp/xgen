import { Component } from '@/types'
import { IconT, PresetsQuery, PresetsResult } from '../types'
import axios from 'axios'

export const GetPresets = async <T,>(
	remote: Component.Request,
	query: PresetsQuery
): Promise<PresetsResult<T> | undefined> => {
	if (!remote) return Promise.resolve(undefined)
	const { keywords, category, withCategories } = query
	const { api, params } = remote
	const data = { params, ...query }
	try {
		const res = await axios.post<any, PresetsResult<T>>(api, data)
		return Promise.resolve(res)
	} catch (err) {
		console.error('[FlowBuilder] GetPresets Error ', err)
		return Promise.reject(err)
	}
}

export const IconName = (icon?: IconT, defaultName: string = 'material-trip_origin'): string => {
	if (icon === undefined) return defaultName
	if (typeof icon === 'string') return icon
	return icon.name
}

export const IconSize = (icon?: IconT, defaultSize: number = 14): number => {
	if (icon === undefined) return defaultSize
	if (typeof icon === 'string') return defaultSize
	return icon.size || defaultSize
}
