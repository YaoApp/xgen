/**
 * Generate the Components sss files, for the shadow dom dynamic import
 */

import child_process from 'child_process'
import fs, { appendFile } from 'fs'
import path from 'path'
import { ExportComponent, ExportComponents } from '../components/exports'

const cwd = process.cwd()
const target_root = path.join(cwd, `/public/components`)

// Generate the sss files for the components
const compile = (name: string, component: ExportComponent) => {
	const output = path.join(target_root, `${name}`)
	const input = path.join(cwd, `__main.less`)

	// Generate the main.less file import the component styles
	const imports: string[] = []
	component.styles.forEach((style, index) => {
		if (style.startsWith('@/')) {
			imports.push(`@import url('/__yao_admin_root/${style.substring(2, style.length)}');`)
			return
		}
		// fs.appendFileSync(input, `@import ".${style}";\n`)
		const lessFile = path.join(cwd, style)
		const targetName = `chunk.${index}.css`
		const targetPath = path.join(output, targetName)
		imports.push(`@import url('/__yao_admin_root/components/${name}/${targetName}');`)

		// Compile the less file
		child_process.execSync(`lessc ${lessFile} ${targetPath}`)

		// Replace :global with :host
		const content = fs.readFileSync(targetPath, 'utf8').replace(/:global/g, '')
		fs.writeFileSync(targetPath, content)
	})

	// Create the index.sss file
	const indexFile = path.join(output, `index.sss`)
	fs.writeFileSync(indexFile, imports.join('\n'))
}

// Generate the sss files for the components
Object.entries(ExportComponents).forEach(([name, component]) => compile(name, component))
