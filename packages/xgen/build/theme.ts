import child_process from 'child_process'
import fs from 'fs'
import lessToJs from 'less-vars-to-js'
import path from 'path'

const antd_theme_path = path.join(process.cwd(), `/node_modules/antd/dist/antd.variable.less`)
const light_theme_path = path.join(process.cwd(), `/styles/theme/light.less`)
const dark_theme_path = path.join(process.cwd(), `/styles/theme/dark.less`)
const init_style_path = path.join(process.cwd(), `/public/styles/init.css`)
const atom_style_path = path.join(process.cwd(), `/public/styles/atom.min.css`)
const output_path = path.join(process.cwd(), `/public/theme`)
const custom_antd_path = path.join(process.cwd(), `/styles/preset/antd.less`)

const light_theme = lessToJs(fs.readFileSync(light_theme_path, 'utf8'))
const dark_theme = lessToJs(fs.readFileSync(dark_theme_path, 'utf8'))

const getModifyVarsString = (theme: any) => {
	return Object.keys(theme).reduce((total, key: string) => {
		const value = theme[key]

		total += `--modify-var="${key}=${value}" `

		return total
	}, '')
}

const light_vars = getModifyVarsString(light_theme)
const dark_vars = getModifyVarsString(dark_theme)

const compile = (vars: string, type: 'light' | 'dark', shadow?: boolean) => {
	child_process.execSync(`lessc --js ${vars} ${antd_theme_path} ${output_path}/${type}.${shadow ? 's' : 'c'}ss`)
}

compile(light_vars, 'light')
compile(dark_vars, 'dark')
compile(light_vars, 'light', true)
compile(dark_vars, 'dark', true)
child_process.execSync(`lessc --js ${custom_antd_path} ${output_path}/custom_antd_styles.css`)

const override_body_styles = fs.readFileSync(init_style_path).toString()
const override_atom_styles = fs.readFileSync(atom_style_path).toString()
const light_css = fs.readFileSync(`${output_path}/light.css`).toString()
const dark_css = fs.readFileSync(`${output_path}/dark.css`).toString()
const custom_antd_styles = fs.readFileSync(`${output_path}/custom_antd_styles.css`).toString()

fs.writeFileSync(`${output_path}/light.css`, light_css + '\n' + override_atom_styles + '\n' + override_body_styles)
fs.writeFileSync(`${output_path}/dark.css`, dark_css + '\n' + override_atom_styles + '\n' + override_body_styles)

fs.writeFileSync(
	`${output_path}/light.sss`,
	light_css + '\n' + override_atom_styles + '\n' + override_body_styles + '\n' + custom_antd_styles
)
fs.writeFileSync(
	`${output_path}/dark.sss`,
	dark_css + '\n' + override_atom_styles + '\n' + override_body_styles + '\n' + custom_antd_styles
)
