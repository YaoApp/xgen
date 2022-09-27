import type { AxiosError } from 'axios'

export declare namespace Utils {
	type ResError = AxiosError['response']
}

export interface Response<T> {
	res: T
	err: Utils.ResError
}
