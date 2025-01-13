import React, { useState, useRef, useEffect } from 'react'
import styles from './index.less'
import MentionList from '../MentionList'
import { App } from '@/types'

interface MentionTextAreaProps {
	value: string
	onChange: (value: string) => void
	onSend: () => void
	loading?: boolean
	onPaste?: (e: React.ClipboardEvent<HTMLDivElement>) => void
	placeholder?: string
	autoSize?: { minRows: number; maxRows: number }
	clear?: (fn: () => void) => void
	focus?: (fn: () => void) => void
	disabled?: boolean
}

const MentionTextArea: React.FC<MentionTextAreaProps> = ({
	value,
	onChange,
	onSend,
	loading,
	onPaste,
	placeholder,
	autoSize = { minRows: 4, maxRows: 16 },
	clear,
	focus,
	disabled = false
}) => {
	const [mentionListVisible, setMentionListVisible] = useState(false)
	const [mentionKeyword, setMentionKeyword] = useState('')
	const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 })
	const [isMentionCompleted, setIsMentionCompleted] = useState(true)
	const [isEmpty, setIsEmpty] = useState(!value)
	const editorRef = useRef<HTMLDivElement>(null)
	const lastAtPosition = useRef<number>(-1)

	// Add useEffect to sync value prop with editor content
	useEffect(() => {
		const editor = editorRef.current
		if (editor && editor.innerText !== value) {
			editor.innerText = value
		}
	}, [value])

	// Handle input
	const handleInput = () => {
		const content = editorRef.current?.innerText || ''
		setIsEmpty(!content.trim())
		onChange(content)
	}

	// Handle keydown
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			if (e.shiftKey || loading) {
				return // Allow line break with Shift+Enter or during loading
			}
			e.preventDefault()
			if (mentionListVisible) return
			onSend()
		} else if (e.key === 'Escape' && mentionListVisible) {
			e.preventDefault()
			hideMentionList()
		}
	}

	// Show mention list
	const showMentionList = (atPosition: number) => {
		const selection = window.getSelection()
		if (!selection?.focusNode) return

		const range = selection.getRangeAt(0)
		const rects = range.getClientRects()
		const rect = rects[0]

		if (!rect || (rect.top === 0 && rect.left === 0)) {
			hideMentionList()
			return
		}

		// 设置相对于窗的绝对位置
		setCursorPosition({
			top: rect.top + rect.height,
			left: rect.left
		})

		lastAtPosition.current = atPosition
		setMentionListVisible(true)
		setMentionKeyword('')
	}

	// Hide mention list
	const hideMentionList = () => {
		setMentionListVisible(false)
		setMentionKeyword('')
		lastAtPosition.current = -1
	}

	// Handle mention selection
	const handleMentionSelect = (mention: App.Mention) => {
		const editor = editorRef.current
		if (!editor) {
			console.error('Editor ref is null')
			return
		}

		const selection = window.getSelection()
		if (!selection?.focusNode) return

		const range = document.createRange()
		const mentionNode = document.createElement('span')
		mentionNode.className = 'mention-tag'
		mentionNode.contentEditable = 'false'
		mentionNode.textContent = `@${mention.name}`
		mentionNode.style.color = 'var(--color_main)'

		// Find text node and position
		let currentNode = editor.firstChild
		let currentOffset = 0
		let targetNode = null
		let targetOffset = 0

		const findTextPosition = (node: Node) => {
			if (node.nodeType === Node.TEXT_NODE) {
				const nodeLength = node.textContent?.length || 0
				if (
					currentOffset <= lastAtPosition.current &&
					lastAtPosition.current < currentOffset + nodeLength
				) {
					targetNode = node
					targetOffset = lastAtPosition.current - currentOffset
					return true
				}
				currentOffset += nodeLength
			} else {
				for (let child of Array.from(node.childNodes)) {
					if (findTextPosition(child)) {
						return true
					}
				}
				if (node.nodeType !== Node.ELEMENT_NODE) {
					currentOffset += node.textContent?.length || 0
				}
			}
			return false
		}

		findTextPosition(editor)

		if (targetNode) {
			try {
				// Set range from @ symbol
				range.setStart(targetNode, targetOffset)
				// Set range to current selection position
				range.setEnd(selection.focusNode, selection.focusOffset)

				// Delete range content
				range.deleteContents()

				// Insert mention tag and space
				range.insertNode(mentionNode)
				range.insertNode(document.createTextNode(' '))

				// Move cursor after space
				range.collapse(false)
				selection.removeAllRanges()
				selection.addRange(range)
			} catch (error) {
				console.error('Range operation failed:', error)
				// Fallback handling when error occurs
				const text = document.createTextNode(`@${mention.name} `)
				range.insertNode(text)
				range.collapse(false)
				selection.removeAllRanges()
				selection.addRange(range)
			}
		}

		hideMentionList()
		handleInput()
	}

	// Add click outside handler
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node
			const editor = editorRef.current
			const mentionList = document.querySelector(`.${styles.mentionList}`)

			if (
				mentionListVisible &&
				editor &&
				!editor.contains(target) &&
				mentionList &&
				!mentionList.contains(target)
			) {
				hideMentionList()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [mentionListVisible])

	// Modify text change monitoring
	useEffect(() => {
		const editor = editorRef.current
		if (!editor) return

		const observer = new MutationObserver(() => {
			const selection = window.getSelection()
			if (!selection?.focusNode) return

			// Get accurate cursor position
			const getCursorPosition = () => {
				let position = 0
				const traverse = (node: Node) => {
					if (node === selection.focusNode) {
						position += selection.focusOffset
						return true
					}
					if (node.nodeType === Node.TEXT_NODE) {
						position += node.textContent?.length || 0
					} else {
						for (let child of Array.from(node.childNodes)) {
							if (traverse(child)) return true
						}
					}
					return false
				}
				traverse(editor)
				return position
			}

			const cursorPosition = getCursorPosition()
			const text = editor.innerText
			const textBeforeCursor = text.slice(0, cursorPosition)

			// If no active mention
			if (lastAtPosition.current === -1) {
				// Only start new mention when @ is input
				if (textBeforeCursor.endsWith('@')) {
					showMentionList(cursorPosition - 1)
					setMentionKeyword('')
				}
				return
			}

			// If there is an active mention, check cursor position
			const currentAtText = text.slice(lastAtPosition.current, cursorPosition)

			// End current mention if cursor is before @ or space/newline is input
			if (cursorPosition <= lastAtPosition.current || /[\s\n]/.test(currentAtText)) {
				hideMentionList()
				return
			}

			// Only update keyword when mention list is visible
			if (mentionListVisible) {
				setMentionKeyword(currentAtText.substring(1)) // Remove @ symbol
			}
		})

		observer.observe(editor, {
			childList: true,
			characterData: true,
			subtree: true
		})

		return () => observer.disconnect()
	}, [mentionListVisible])

	// Add method to clear editor content
	useEffect(() => {
		if (clear) {
			clear(() => {
				if (editorRef.current) {
					editorRef.current.innerHTML = ''
					setIsEmpty(true)
					handleInput()
				}
			})
		}
	}, [clear])

	// Add paste handler
	const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
		// Handle custom paste logic if provided first
		if (onPaste) {
			onPaste(e)
			// If custom handler prevented default, don't do anything else
			if (e.defaultPrevented) {
				return
			}
		}

		// Prevent default paste only if we're handling it ourselves
		e.preventDefault()

		// Get clipboard data
		const clipboardData = e.clipboardData
		let content = clipboardData.getData('text/plain')

		// If no content, don't proceed
		if (!content) return

		try {
			// Use execCommand for more reliable paste behavior
			document.execCommand('insertText', false, content)
		} catch (err) {
			// Fallback to manual insertion if execCommand fails
			const selection = window.getSelection()
			if (!selection?.rangeCount) return

			const range = selection.getRangeAt(0)
			const textNode = document.createTextNode(content)

			range.deleteContents()
			range.insertNode(textNode)

			// Move cursor to end of inserted text
			range.setStartAfter(textNode)
			range.setEndAfter(textNode)
			selection.removeAllRanges()
			selection.addRange(range)
		}

		// Trigger input handler to update value
		handleInput()
	}

	// Add useEffect for focus registration
	useEffect(() => {
		if (focus) {
			focus(() => {
				editorRef.current?.focus()
			})
		}
	}, [focus])

	return (
		<div className={styles.mentionTextArea}>
			<div
				ref={editorRef}
				className={`${styles.editor} ${isEmpty ? styles.empty : ''}`}
				contentEditable={!disabled}
				onInput={handleInput}
				onKeyDown={handleKeyDown}
				onPaste={handlePaste}
				data-placeholder={placeholder}
				style={{
					minHeight: `${autoSize.minRows * 24}px`,
					maxHeight: `${autoSize.maxRows * 24}px`,
					cursor: disabled ? 'not-allowed' : 'text'
				}}
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
