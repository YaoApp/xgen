import child_process from 'child_process'
import fs from 'fs'
import lessToJs from 'less-vars-to-js'
import path from 'path'

const antd_theme_path = path.join(process.cwd(), `/node_modules/antd/dist/antd.variable.less`)
const light_theme_path = path.join(process.cwd(), `/styles/theme/light.less`)
const dark_theme_path = path.join(process.cwd(), `/styles/theme/dark.less`)
const output_path = path.join(process.cwd(), `/public/theme`)

const light_theme = lessToJs(fs.readFileSync(light_theme_path, 'utf8'))
const dark_theme = lessToJs(fs.readFileSync(dark_theme_path, 'utf8'))

const getModifyVarsString = (theme:object) => {
      return Object.keys(theme).reduce((total, key: string) => {
            const value = theme[key]
      
            total += `--modify-var="${key}=${value}" `
      
            return total
      }, '')
}

const light_vars = getModifyVarsString(light_theme)
const dark_vars = getModifyVarsString(dark_theme)

const compile = (vars: string, type: 'light' | 'dark') => {
      child_process.execSync(
            `lessc --js --compress -x ${vars} ${antd_theme_path} ${output_path}/${type}.css`
      )
}

compile(light_vars,'light')
compile(dark_vars,'dark')


