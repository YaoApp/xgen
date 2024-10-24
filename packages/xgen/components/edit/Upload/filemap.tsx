import Video from './components/Video'
import Audio from './components/Audio'
import Image from './components/Image'

import type { FileType, PreviewProps } from './types'
import { UploadFile } from 'antd'

export default {
	image: {
		listType: 'picture-card',
		className: 'image',
		placeholder: {
			'zh-CN': '上传图片',
			'en-US': 'Upload Image'
		},
		placeholderIcon: 'icon-upload',
		preview: (props: PreviewProps, file: UploadFile<string>, remove: () => void) => {
			return <Image file={file} imageSize={getSize(props.size)} remove={remove} />
		}
	},

	audio: {
		listType: 'picture-card',
		className: 'image',
		placeholder: {
			'zh-CN': '上传音频',
			'en-US': 'Upload Audio'
		},
		placeholderIcon: 'icon-upload',
		preview: (props: PreviewProps, file: UploadFile<string>, remove: () => void) => {
			return <div>Image</div>
		}
	},

	file: {
		listType: 'picture-card',
		className: 'image',
		placeholder: {
			'zh-CN': '上传文件',
			'en-US': 'Upload File'
		},
		placeholderIcon: 'icon-upload',
		preview: (props: PreviewProps, file: UploadFile<string>, remove: () => void) => {
			return <div>File</div>
		}
	},

	video: {
		listType: 'picture-card',
		className: 'image',
		placeholder: {
			'zh-CN': '上传视频',
			'en-US': 'Upload Video'
		},
		placeholderIcon: 'icon-upload',
		preview: (props: PreviewProps, file: UploadFile<string>, remove: () => void) => {
			return <div>Video</div>
		}
	}
} as FileType

function getSize(size: PreviewProps['size']): PreviewProps['size'] {
	const defaultSize: PreviewProps['size'] = {
		width: size?.width || '90px',
		height: size?.height || '90px',
		ratio: size?.ratio || 1
	}

	if (defaultSize.ratio && defaultSize.ratio != 1) {
		const width = parseInt(defaultSize.width as string)
		const height = parseInt(defaultSize.height as string)
		if (!width && !height) {
			defaultSize.width = '100%'
			defaultSize.height = `${100 * defaultSize.ratio}%`
		}
		if (width) {
			defaultSize.width = `${width * defaultSize.ratio}px`
		} else if (height) defaultSize.height = `${width * defaultSize.ratio}px`
	}

	return defaultSize
}
