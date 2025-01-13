import { useState } from 'react'
import { Table, Button, Upload, Space, Typography } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import styles from '../index.less'

const { Title } = Typography

interface FilesProps {
	files: UploadFile[]
	onFilesChange: (files: UploadFile[]) => void
}

// Generate 100 test files
const fileTypes = [
	{ ext: 'json', type: 'application/json' },
	{ ext: 'yaml', type: 'application/yaml' },
	{ ext: 'md', type: 'text/markdown' },
	{ ext: 'js', type: 'application/javascript' },
	{ ext: 'py', type: 'text/x-python' },
	{ ext: 'ts', type: 'application/typescript' }
]

const testFiles: UploadFile[] = Array.from({ length: 100 }, (_, index) => {
	const fileType = fileTypes[index % fileTypes.length]
	return {
		uid: String(index + 1),
		name: `file_${index + 1}.${fileType.ext}`,
		size: Math.floor(Math.random() * 1024 * 1024 * 5), // Random size up to 5MB
		type: fileType.type,
		status: 'done'
	}
})

export default function Files({ files: propFiles, onFilesChange }: FilesProps) {
	const [files, setFiles] = useState<UploadFile[]>(testFiles)

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			ellipsis: true
		},
		{
			title: 'Size',
			dataIndex: 'size',
			key: 'size',
			width: 120,
			render: (size: number) => {
				if (size < 1024) {
					return `${size} B`
				} else if (size < 1024 * 1024) {
					return `${(size / 1024).toFixed(1)} KB`
				} else {
					return `${(size / (1024 * 1024)).toFixed(1)} MB`
				}
			}
		},
		{
			title: 'Action',
			key: 'action',
			width: 80,
			render: (_: any, record: UploadFile) => (
				<Button
					type='text'
					icon={<DeleteOutlined />}
					onClick={() => handleRemove(record)}
					style={{ color: 'var(--color_text_grey)' }}
				/>
			)
		}
	]

	const handleRemove = (file: UploadFile) => {
		const newFiles = files.filter((item) => item.uid !== file.uid)
		setFiles(newFiles)
		onFilesChange(newFiles)
	}

	const handleUpload = (info: any) => {
		const newFiles = [...files, ...info.fileList]
		setFiles(newFiles)
		onFilesChange(newFiles)
	}

	return (
		<div className={styles.files}>
			<div className={styles.filesHeader}>
				<Title level={5} style={{ margin: 0, fontWeight: 500 }}>
					Assistant Files
				</Title>
				<Upload
					multiple
					fileList={[]}
					beforeUpload={() => false}
					onChange={handleUpload}
					showUploadList={false}
				>
					<Button type='primary' icon={<UploadOutlined />}>
						Upload
					</Button>
				</Upload>
			</div>
			<div className={styles.filesTable}>
				<Table
					dataSource={files}
					columns={columns}
					pagination={false}
					rowKey='uid'
					size='middle'
					scroll={{ y: 'calc(100vh - 64px - 24px - 48px - 48px - 48px - 72px)' }}
				/>
			</div>
		</div>
	)
}
