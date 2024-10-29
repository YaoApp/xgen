import { UploadProps } from 'antd'
import { IRequest, S3RequestProps } from '../types'

// Not supported in this version, will be implemented in the future
export class S3Request implements IRequest {
	props: S3RequestProps = { api: '' }
	constructor(props: S3RequestProps) {
		this.props = props
	}
	Upload: UploadProps['customRequest'] = async (options) => {}
	Abort = () => {}
}
