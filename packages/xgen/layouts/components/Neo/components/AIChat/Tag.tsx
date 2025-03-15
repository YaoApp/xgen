import { FC } from 'react'
import styles from './Tag.less'

/**
 * Predefined color combinations for tags
 * Each combination has a light mode and dark mode variant
 */
const TAG_COLORS = [
	{
		light: { background: 'rgba(24, 144, 255, 0.15)', color: '#1890FF' },
		dark: { background: 'rgba(24, 144, 255, 0.2)', color: '#40A9FF' }
	}, // Blue
	{
		light: { background: 'rgba(82, 196, 26, 0.15)', color: '#52C41A' },
		dark: { background: 'rgba(82, 196, 26, 0.2)', color: '#73D13D' }
	}, // Green
	{
		light: { background: 'rgba(250, 140, 22, 0.15)', color: '#FA8C16' },
		dark: { background: 'rgba(250, 140, 22, 0.2)', color: '#FFA940' }
	}, // Orange
	{
		light: { background: 'rgba(245, 34, 45, 0.15)', color: '#F5222D' },
		dark: { background: 'rgba(245, 34, 45, 0.2)', color: '#FF4D4F' }
	}, // Red
	{
		light: { background: 'rgba(114, 46, 209, 0.15)', color: '#722ED1' },
		dark: { background: 'rgba(114, 46, 209, 0.2)', color: '#9254DE' }
	}, // Purple
	{
		light: { background: 'rgba(212, 177, 6, 0.15)', color: '#D4B106' },
		dark: { background: 'rgba(212, 177, 6, 0.2)', color: '#FADB14' }
	}, // Yellow
	{
		light: { background: 'rgba(19, 194, 194, 0.15)', color: '#13C2C2' },
		dark: { background: 'rgba(19, 194, 194, 0.2)', color: '#36CFC9' }
	}, // Cyan
	{
		light: { background: 'rgba(235, 47, 150, 0.15)', color: '#EB2F96' },
		dark: { background: 'rgba(235, 47, 150, 0.2)', color: '#F759AB' }
	}, // Pink
	{
		light: { background: 'rgba(47, 84, 235, 0.15)', color: '#2F54EB' },
		dark: { background: 'rgba(47, 84, 235, 0.2)', color: '#597EF7' }
	}, // Geekblue
	{
		light: { background: 'rgba(250, 84, 28, 0.15)', color: '#FA541C' },
		dark: { background: 'rgba(250, 84, 28, 0.2)', color: '#FF7A45' }
	} // Volcano
]

/**
 * Get a consistent color for a tag based on its text
 * @param text Tag text to hash
 * @param isDarkMode Whether the app is in dark mode
 * @returns A color object with background and text colors
 */
const getTagColor = (text: string, isDarkMode: boolean) => {
	// Simple hash function to generate a number from a string
	let hash = 0
	for (let i = 0; i < text.length; i++) {
		hash = text.charCodeAt(i) + ((hash << 5) - hash)
	}

	// Use the hash to select a color from the predefined colors
	const index = Math.abs(hash) % TAG_COLORS.length
	const colorSet = isDarkMode ? TAG_COLORS[index].dark : TAG_COLORS[index].light
	return colorSet
}

interface Props {
	/** Tag text content */
	children: React.ReactNode
	/** Tag color variant */
	variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'auto'
}

const Tag: FC<Props> = ({ children, variant = 'primary' }) => {
	// Check if dark mode is enabled using the global theme variable
	const isDarkMode = (global as any).theme === 'dark'

	// If variant is 'auto', select a color based on the tag text
	if (variant === 'auto' && typeof children === 'string') {
		const { background, color } = getTagColor(children, isDarkMode)

		return (
			<span
				className={styles.tag}
				style={{
					background,
					color,
					borderRadius: '4px',
					fontWeight: 500,
					boxShadow: isDarkMode ? '0 0 0 1px rgba(255, 255, 255, 0.08)' : 'none'
				}}
			>
				{children}
			</span>
		)
	}

	// Otherwise, use the predefined styles
	return <span className={`${styles.tag} ${styles[variant]}`}>{children}</span>
}

export default Tag
