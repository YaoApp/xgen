import colors from '@/styles/preset/vars'

export const Color = (color: string, theme: 'dark' | 'light'): string => {
	const presetColors: Record<string, string> = {
		primary: theme === 'dark' ? colors.dark.color_main : colors.light.color_main,
		warning: theme === 'dark' ? colors.dark.color_warning : colors.light.color_warning,
		success: theme === 'dark' ? colors.dark.color_success : colors.light.color_success,
		danger: theme === 'dark' ? colors.dark.color_danger : colors.light.color_danger,
		text: theme === 'dark' ? colors.dark.color_text : colors.light.color_text,
		grey: theme === 'dark' ? colors.dark.color_text_grey : colors.light.color_text_grey,
		gray: theme === 'dark' ? colors.dark.color_text_grey : colors.light.color_text_grey,
		title: theme === 'dark' ? colors.dark.color_title : colors.light.color_title
	}
	return presetColors[color] || color
}
