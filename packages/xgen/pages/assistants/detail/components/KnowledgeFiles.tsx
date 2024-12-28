import React from 'react'
import { Upload, List, Button, message } from 'antd'
import { UploadOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import styles from '../index.less'

interface KnowledgeFilesProps {
	files: UploadFile<any>[]
	onFilesChange: (files: UploadFile<any>[]) => void
}

const fileTypes = ['PDF', 'Markdown', 'Word', 'Text', 'Image', 'Excel']
const testFiles = Array.from({ length: 100 }, (_, index) => ({
	id: String(index + 1),
	name: `file_${index + 1}.${fileTypes[index % fileTypes.length].toLowerCase()}`,
	size: `${Math.floor(Math.random() * 10000) / 10}KB`,
	uploadTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
	type: fileTypes[index % fileTypes.length]
}))

export default function KnowledgeFiles({ files, onFilesChange }: KnowledgeFilesProps) {
	const handleUpload = (info: any) => {
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`)
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`)
		}
	}

	const handleDelete = (id: string) => {
		message.success('File deleted successfully')
	}

	return (
		<div className={styles.knowledgeFiles}>
			<div className={styles.uploadSection}>
				<Upload name='file' action='/api/upload' onChange={handleUpload} showUploadList={false}>
					<Button type='primary' icon={<UploadOutlined />} size='large'>
						Upload Files
					</Button>
				</Upload>
			</div>

			<List
				className={styles.fileList}
				itemLayout='horizontal'
				dataSource={testFiles}
				renderItem={(item) => (
					<List.Item
						actions={[
							<Button
								key='delete'
								type='text'
								danger
								icon={<DeleteOutlined />}
								onClick={() => handleDelete(item.id)}
							>
								Delete
							</Button>
						]}
					>
						<List.Item.Meta
							avatar={
								<FileTextOutlined
									style={{ fontSize: '24px', color: 'var(--color_text_grey)' }}
								/>
							}
							title={item.name}
							description={`${item.type} · ${item.size} · Uploaded on ${item.uploadTime}`}
						/>
					</List.Item>
				)}
			/>
		</div>
	)
}
