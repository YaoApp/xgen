import { useState } from 'react'
import { Form, Input, Button, Space, Select, Divider } from 'antd'
import { PlusOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons'
import { getLocale } from '@umijs/max'
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	DroppableProvided,
	DraggableProvided,
	DraggableStateSnapshot
} from 'react-beautiful-dnd'
import styles from '../index.less'

const { TextArea } = Input
const { Option } = Select

interface Message {
	role: 'system' | 'user' | 'assistant' | 'developer'
	content: string
}

interface OptionItem {
	key: string
	value: string
}

interface PromptsProps {
	value?: Message[]
	options?: OptionItem[]
	onChange?: (messages: Message[]) => void
	onOptionsChange?: (options: OptionItem[]) => void
}

export default function Prompts({ value = [], options = [], onChange, onOptionsChange }: PromptsProps) {
	const [messages, setMessages] = useState<Message[]>(value)
	const [optionItems, setOptionItems] = useState<OptionItem[]>(options)
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'
	const [form] = Form.useForm()
	const readonly = Form.useWatch('readonly', form)

	const handleAdd = () => {
		if (readonly) return
		const newMessage: Message = { role: 'system', content: '' }
		const newMessages = [...messages, newMessage]
		setMessages(newMessages)
		onChange?.(newMessages)
	}

	const handleAddOption = () => {
		if (readonly) return
		const newOption: OptionItem = { key: '', value: '' }
		const newOptions = [...optionItems, newOption]
		setOptionItems(newOptions)
		onOptionsChange?.(newOptions)
	}

	const handleRemove = (index: number) => {
		if (readonly) return
		const newMessages = messages.filter((_, i) => i !== index)
		setMessages(newMessages)
		onChange?.(newMessages)
	}

	const handleRemoveOption = (index: number) => {
		if (readonly) return
		const newOptions = optionItems.filter((_, i) => i !== index)
		setOptionItems(newOptions)
		onOptionsChange?.(newOptions)
	}

	const handleContentChange = (index: number, content: string) => {
		if (readonly) return
		const newMessages = [...messages]
		newMessages[index] = { ...newMessages[index], content }
		setMessages(newMessages)
		onChange?.(newMessages)
	}

	const handleOptionChange = (index: number, field: 'key' | 'value', value: string) => {
		if (readonly) return
		const newOptions = [...optionItems]
		newOptions[index] = { ...newOptions[index], [field]: value }
		setOptionItems(newOptions)
		onOptionsChange?.(newOptions)
	}

	const handleRoleChange = (index: number, role: Message['role']) => {
		if (readonly) return
		const newMessages = [...messages]
		newMessages[index] = { ...newMessages[index], role }
		setMessages(newMessages)
		onChange?.(newMessages)
	}

	const handleDragEnd = (result: DropResult) => {
		if (readonly || !result.destination) return

		const items = Array.from(messages)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)

		setMessages(items)
		onChange?.(items)
	}

	// 获取角色的本地化名称
	const getRoleLabel = (role: string) => {
		switch (role) {
			case 'system':
				return is_cn ? '系统' : 'System'
			case 'user':
				return is_cn ? '用户' : 'User'
			case 'assistant':
				return is_cn ? '助手' : 'Assistant'
			case 'developer':
				return is_cn ? '开发者' : 'Developer'
			default:
				return role
		}
	}

	return (
		<div className={styles.prompts}>
			<div className={styles.promptsSection}>
				<div className={styles.promptsHeader}>
					<h5>{is_cn ? '消息' : 'Messages'}</h5>
					{!readonly && (
						<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
							{is_cn ? '添加消息' : 'Add Message'}
						</Button>
					)}
				</div>
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId='messages'>
						{(provided: DroppableProvided) => (
							<div
								className={styles.promptsList}
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								{messages.map((message, index) => (
									<Draggable
										key={index}
										draggableId={`message-${index}`}
										index={index}
										isDragDisabled={readonly}
									>
										{(
											provided: DraggableProvided,
											snapshot: DraggableStateSnapshot
										) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												className={`${styles.promptItem} ${
													snapshot.isDragging ? styles.dragging : ''
												}`}
											>
												<div className={styles.promptItemHeader}>
													<div className={styles.promptItemLeft}>
														{!readonly && (
															<div
																{...provided.dragHandleProps}
																className={
																	styles.dragHandle
																}
															>
																<HolderOutlined />
															</div>
														)}
														<Select
															value={message.role}
															onChange={(role) =>
																handleRoleChange(
																	index,
																	role
																)
															}
															style={{ width: 120 }}
															disabled={readonly}
														>
															<Option value='system'>
																{is_cn
																	? '系统'
																	: 'System'}
															</Option>
															{/* <Option value='user'>
																{is_cn
																	? '用户'
																	: 'User'}
															</Option>
															<Option value='assistant'>
																{is_cn
																	? '助手'
																	: 'Assistant'}
															</Option> */}
															<Option value='developer'>
																{is_cn
																	? '开发者'
																	: 'Developer'}
															</Option>
														</Select>
													</div>
													{!readonly && (
														<Button
															type='text'
															icon={<DeleteOutlined />}
															onClick={() =>
																handleRemove(index)
															}
															className={styles.deleteBtn}
														/>
													)}
												</div>
												<TextArea
													value={message.content}
													onChange={(e) =>
														handleContentChange(
															index,
															e.target.value
														)
													}
													placeholder={
														is_cn
															? `输入${getRoleLabel(
																	message.role
															  )}消息...`
															: `Enter ${message.role} message...`
													}
													autoSize={{ minRows: 3, maxRows: 6 }}
													disabled={readonly}
												/>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>

			<Divider style={{ margin: '24px 0' }} />

			<div className={styles.promptsSection}>
				<div className={styles.promptsHeader}>
					<h5>{is_cn ? '选项' : 'Options'}</h5>
					{!readonly && (
						<Button type='primary' icon={<PlusOutlined />} onClick={handleAddOption}>
							{is_cn ? '添加选项' : 'Add Option'}
						</Button>
					)}
				</div>
				<div className={styles.optionsList}>
					{optionItems.map((item, index) => (
						<div key={index} className={styles.optionItem}>
							<div className={styles.optionInputs}>
								<Input
									value={item.key}
									onChange={(e) => handleOptionChange(index, 'key', e.target.value)}
									placeholder={is_cn ? '名称' : 'Name'}
									disabled={readonly}
								/>
								<Input
									value={item.value}
									onChange={(e) =>
										handleOptionChange(index, 'value', e.target.value)
									}
									placeholder={is_cn ? '值' : 'Value'}
									disabled={readonly}
								/>
							</div>
							{!readonly && (
								<Button
									type='text'
									icon={<DeleteOutlined />}
									onClick={() => handleRemoveOption(index)}
									className={styles.deleteBtn}
								/>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
