import axios from 'axios'
import { Presets, Remote, Setting } from './types'

export const GetSetting = async (setting?: Remote | Setting): Promise<Setting> => {
	if (setting && 'api' in setting) {
		setting = setting as Remote
		const api = setting.api
		const params = { ...setting.params }
		try {
			const res = await axios.get<any, Setting>(api, { params })
			return Promise.resolve(res)
		} catch (err) {
			console.error('[GetSetting] remote search error', err)
			return Promise.reject(err)
		}
	}
	return Promise.resolve(setting as Setting)
}

export const GetPresets = async (presets?: Remote | Presets): Promise<Presets> => {
	// Typeof Remote
	if (presets && 'api' in presets) {
		presets = presets as Remote
		const api = presets.api
		const params = { ...presets.params }
		try {
			const res = await axios.get<any, Presets>(api, { params })
			return Promise.resolve(res)
		} catch (err) {
			console.error('[GetSetting] remote search error', err)
			return Promise.reject(err)
		}
	}
	return Promise.resolve(presets as Presets)
}
