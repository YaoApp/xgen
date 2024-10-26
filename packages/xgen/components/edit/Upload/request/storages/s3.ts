import { UploadProps } from 'antd'
import { IRequest, S3RequestProps } from '../types'

export class S3Request implements IRequest {
	props: S3RequestProps = { api: '' }
	constructor(props: S3RequestProps) {
		this.props = props
	}
	Upload: UploadProps['customRequest'] = async (options) => {}
}
