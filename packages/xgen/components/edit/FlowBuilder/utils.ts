import axios from 'axios'
import { FlowValue, IconT, PresetsQuery, PresetsResult, Remote, Setting } from './types'
import { Component } from '@/types'
import { nanoid } from 'nanoid/non-secure'

export const GetSetting = async (setting?: Remote | Setting): Promise<Setting> => {
	if (setting && 'api' in setting) {
		setting = setting as Remote
		const api = setting.api
		const params = { ...setting.params }
		try {
			const res = await axios.get<any, Setting>(api, { params })
			return Promise.resolve(res)
		} catch (err) {
			console.error('[FlowBuilder] GetSetting Error ', err)
			return Promise.reject(err)
		}
	}
	return Promise.resolve(setting as Setting)
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

export const GetValues = (value?: FlowValue | FlowValue[]): FlowValue[] => {
	if (value === undefined || value === null) return []
	if (Array.isArray(value)) return value
	return [value]
}

export const valueToData = (value?: FlowValue | FlowValue[], defaultValue?: FlowValue | FlowValue[]): any => {}

export const Execute = async (
	remote: Component.Request,
	value: FlowValue,
	withs: Record<string, any>
): Promise<any> => {
	if (!remote) return Promise.resolve(undefined)
	const { api, params } = remote
	try {
		const res = await axios.request<any>({
			url: api,
			method: 'post',
			params,
			data: { flow: value, params: { ...params, ...withs } }
		})
		return Promise.resolve(res)
	} catch (err) {
		console.error('[FlowBuilder] Execute Error ', err)
		return Promise.reject(err)
	}
}

export const GetPresets = async (
	remote: Component.Request,
	query: PresetsQuery
): Promise<PresetsResult | undefined> => {
	if (!remote) return Promise.resolve(undefined)
	const { keywords, category, withCategories } = query
	const { api, params } = remote
	const data = { params, ...query }
	try {
		const res = await axios.post<any, PresetsResult>(api, data)
		return Promise.resolve(res)
	} catch (err) {
		console.error('[FlowBuilder] GetPresets Error ', err)
		return Promise.reject(err)
	}
}

export const CreateID = () => '_' + nanoid() + new Date().valueOf()
