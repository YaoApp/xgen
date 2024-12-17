import React, { useState, useRef, useEffect } from 'react'
import { Input } from 'antd'
import type { TextAreaRef } from 'antd/es/input/TextArea'
import styles from './index.less'
import MentionList from '../MentionList'
import { App } from '@/types'

const { TextArea } = Input

interface MentionTextAreaProps {
	value: string
	onChange: (value: string) => void
	onSend: () => void
	loading?: boolean
	onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void
	placeholder?: string
	autoSize?: { minRows: number; maxRows: number }
}

const MentionTextArea: React.FC<MentionTextAreaProps> = ({
	value,
	onChange,
	onSend,
	loading,
	onPaste,
	placeholder,
	autoSize = { minRows: 4, maxRows: 16 }
}) => {
	const [mentionListVisible, setMentionListVisible] = useState(false)
	const [mentionKeyword, setMentionKeyword] = useState('')
	const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 })
	const [mentions, setMentions] = useState<App.Mention[]>([])
	const textAreaRef = useRef<TextAreaRef>(null)
	const lastAtPosition = useRef<number>(-1)

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value
		const cursorPos = e.target.selectionStart

		// Check if we need to show mention list
		if (newValue[cursorPos - 1] === '@') {
			lastAtPosition.current = cursorPos - 1
			showMentionList()
		} else if (lastAtPosition.current >= 0 && cursorPos > lastAtPosition.current) {
			const keyword = newValue.slice(lastAtPosition.current + 1, cursorPos)
			setMentionKeyword(keyword)
		} else {
			hideMentionList()
		}

		onChange(newValue)
	}

	// Show mention list
	const showMentionList = () => {
		const textArea = textAreaRef.current?.resizableTextArea?.textArea
		if (!textArea) return

		const { selectionStart } = textArea
		const textBeforeCursor = textArea.value.slice(0, selectionStart)
		const lines = textBeforeCursor.split('\n')
		const currentLineNumber = lines.length - 1
		const currentLineText = lines[currentLineNumber]

		// Calculate cursor position
		const lineHeight = 24 // Approximate line height
		const charWidth = 8 // Approximate character width
		const top = (currentLineNumber + 1) * lineHeight
		const left = currentLineText.length * charWidth

		setCursorPosition({ top, left })
		setMentionListVisible(true)
	}

	// Hide mention list
	const hideMentionList = () => {
		setMentionListVisible(false)
		lastAtPosition.current = -1
		setMentionKeyword('')
	}

	// Handle mention selection
	const handleMentionSelect = (mention: App.Mention) => {
		if (lastAtPosition.current < 0) return

		const beforeMention = value.slice(0, lastAtPosition.current)
		const afterMention = value.slice(textAreaRef.current?.resizableTextArea?.textArea.selectionStart)
		const newValue = `${beforeMention}@${mention.name} ${afterMention}`

		onChange(newValue)
		hideMentionList()
	}

	// Handle key press
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey && !loading) {
			e.preventDefault()
			if (mentionListVisible) return
			onSend()
		} else if (e.key === 'Escape' && mentionListVisible) {
			e.preventDefault()
			hideMentionList()
		}
	}

	return (
		<div className={styles.mentionTextArea}>
			<TextArea
				ref={textAreaRef}
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onPaste={onPaste}
				placeholder={placeholder}
				autoSize={autoSize}
			/>
			{mentionListVisible && (
				<MentionList
					keyword={mentionKeyword}
					position={cursorPosition}
					onSelect={handleMentionSelect}
					onClose={hideMentionList}
				/>
			)}
		</div>
	)
}

export default MentionTextArea
