import fs from 'fs'
import path from 'path'

const sp_shadow = path.join(process.cwd(), `/widgets/ShadowTheme/index.tsx`)
const file = fs.readFileSync(sp_shadow).toString()

const before = () => {
      const _file= file.replaceAll('.sss', '.css')

      fs.writeFileSync(sp_shadow,_file)
}
const after = () => {
      const _file = file.replaceAll('.css', '.sss')
      
      fs.writeFileSync(sp_shadow,_file)
}

export {before,after}