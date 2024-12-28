import { useState } from 'react'
import { Form, Input, Button, Space, Select, Divider } from 'antd'
import { PlusOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons'
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

	const handleAdd = () => {
		const newMessage: Message = { role: 'system', content: '' }
		const newMessages = [...messages, newMessage]
		setMessages(newMessages)
		onChange?.(newMessages)
	}

	const handleAddOption = () => {
		const newOption: OptionItem = { key: '', value: '' }
		const newOptions = [...optionItems, newOption]
		setOptionItems(newOptions)
		onOptionsChange?.(newOptions)
	}

	const handleRemove = (index: number) => {
		const newMessages = messages.filter((_, i) => i !== index)
		setMessages(newMessages)
		onChange?.(newMessages)
	}

	const handleRemoveOption = (index: number) => {
		const newOptions = optionItems.filter((_, i) => i !== index)
		setOptionItems(newOptions)
		onOptionsChange?.(newOptions)
	}

	const handleContentChange = (index: number, content: string) => {
		const newMessages = [...messages]
		newMessages[index] = { ...newMessages[index], content }
		setMessages(newMessages)
		onChange?.(newMessages)
	}

	const handleOptionChange = (index: number, field: 'key' | 'value', value: string) => {
		const newOptions = [...optionItems]
		newOptions[index] = { ...newOptions[index], [field]: value }
		setOptionItems(newOptions)
		onOptionsChange?.(newOptions)
	}

	const handleRoleChange = (index: number, role: Message['role']) => {
		const newMessages = [...messages]
		newMessages[index] = { ...newMessages[index], role }
		setMessages(newMessages)
		onChange?.(newMessages)
	}

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return

		const items = Array.from(messages)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)

		setMessages(items)
		onChange?.(items)
	}

	return (
		<div className={styles.prompts}>
			<div className={styles.promptsSection}>
				<div className={styles.promptsHeader}>
					<h5>Messages</h5>
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
						Add Message
					</Button>
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
														<div
															{...provided.dragHandleProps}
															className={styles.dragHandle}
														>
															<HolderOutlined />
														</div>
														<Select
															value={message.role}
															onChange={(role) =>
																handleRoleChange(
																	index,
																	role
																)
															}
															style={{ width: 120 }}
														>
															<Option value='system'>
																System
															</Option>
															<Option value='user'>
																User
															</Option>
															<Option value='assistant'>
																Assistant
															</Option>
															<Option value='developer'>
																Developer
															</Option>
														</Select>
													</div>
													<Button
														type='text'
														icon={<DeleteOutlined />}
														onClick={() => handleRemove(index)}
														className={styles.deleteBtn}
													/>
												</div>
												<TextArea
													value={message.content}
													onChange={(e) =>
														handleContentChange(
															index,
															e.target.value
														)
													}
													placeholder={`Enter ${message.role} message...`}
													autoSize={{ minRows: 3, maxRows: 6 }}
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
					<h5>Options</h5>
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAddOption}>
						Add Option
					</Button>
				</div>
				<div className={styles.optionsList}>
					{optionItems.map((item, index) => (
						<div key={index} className={styles.optionItem}>
							<div className={styles.optionInputs}>
								<Input
									value={item.key}
									onChange={(e) => handleOptionChange(index, 'key', e.target.value)}
									placeholder='Name'
								/>
								<Input
									value={item.value}
									onChange={(e) =>
										handleOptionChange(index, 'value', e.target.value)
									}
									placeholder='Value'
								/>
							</div>
							<Button
								type='text'
								icon={<DeleteOutlined />}
								onClick={() => handleRemoveOption(index)}
								className={styles.deleteBtn}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
