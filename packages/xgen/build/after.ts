import fs from 'fs'
import path from 'path'

const optimizeCss = () => {
	const umi_css_path = path.join(process.cwd(), `/dist/umi.css`)

	fs.writeFileSync(umi_css_path, '')
}

optimizeCss()
