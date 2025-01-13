const base = {
	color_warning: '#faad14',
	color_warning_bg: '#fff7e6',
	color_success: '#00c853',
	color_success_bg: '#f6ffed',
	color_danger: '#e62965',
	color_danger_bg: '#fff1f0',
	color_info: '#3371fc',
	color_info_bg: '#e6f7ff'
}

export default {
	light: {
		...base,
		color_main: '#3371fc',
		color_primary: '#3371fc',
		color_main_hover: '#4580ff',
		color_main_active: '#2861e6',
		color_text: '#111',
		color_text_grey: '#999',
		color_text_light: '#666',
		color_text_contrast: 'black',
		color_title: '#363636',
		color_title_grey: '#a9abac',
		color_placeholder: '#727272',
		color_page_title: '#363636',
		color_bg: '#f0f0f0',
		color_bg_nav: '#f9f9f9',
		color_bg_menu: '#ffffff',
		color_bg_hover: '#f5f5f5',
		color_bg_active: '#e6e6e6',
		color_border: '#e6e6e6',
		color_border_light: 'rgba(0, 0, 0, 0.06)',
		color_border_soft: 'rgba(0, 0, 0, 0.03)'
	},
	dark: {
		...base,
		color_main: '#4580ff',
		color_primary: '#4580ff',
		color_main_hover: '#5590ff',
		color_main_active: '#3470ef',
		color_text: '#a2a5b9',
		color_text_grey: '#aaa',
		color_text_light: '#888',
		color_text_contrast: 'white',
		color_title: '#aaaab3',
		color_title_grey: '#888890',
		color_warning_bg: 'rgba(250, 173, 20, 0.15)',
		color_success_bg: 'rgba(0, 200, 83, 0.15)',
		color_danger_bg: 'rgba(230, 41, 101, 0.15)',
		color_info_bg: 'rgba(69, 128, 255, 0.15)',
		color_placeholder: '#727272',
		color_page_title: '#999',
		color_bg: '#3b3b41',
		color_bg_nav: '#232326',
		color_bg_menu: '#2f2f34',
		color_bg_hover: '#444449',
		color_bg_active: '#4d4d53',
		color_border: '#404046',
		color_border_light: 'rgba(255, 255, 255, 0.06)',
		color_border_soft: 'rgba(255, 255, 255, 0.03)'
	}
}

export const colors = {
	light: ['#516b91', '#59c4e6', '#edafda', '#93b7e3', '#a5e7f0', '#cbb0e3', '#e01f54', '#ffb248', 'fe8463'],
	dark: ['#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9', '#05c091', '#ff8a45', '#8d48e3', '#dd79ff']
}
