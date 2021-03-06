import { request } from 'umi'

export const inspect = () => {
	return request(`/api/xiang/inspect`)
}

export const getSetting = ({
	type,
	name
}: {
	type: 'table' | 'chart' | 'kanban'
	name: string
}) => {
	return request(`/api/xiang/${type}/${name}/setting`)
}

export const getOSSToken = () => {
	return request(`/api/xiang/storage/token?name=oss`)
}

export const getUserMenu = () => {
	return request(`/api/xiang/user/menu`)
}
