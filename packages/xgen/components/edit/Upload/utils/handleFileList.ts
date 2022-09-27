import type { UploadFile } from 'antd/lib/upload/interface'

export default (fileList: Array<UploadFile<string>>) => {
	return fileList.reduce((total: Array<string>, item: any) => {
		total.push(item.response)

		return total
	}, [])
}
