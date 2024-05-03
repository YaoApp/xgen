export const Dot = (data: Record<string, any>, max = 2): Record<string, any> => {
	// data["foo"] = {"bar": "hello", "args": ["a", {"hi": "hello"}, "b"]}
	// -> data["foo"] ={"bar": "hello"}
	//    data["foo.bar"] = "hello"
	//    data["foo.args"] = ["a", {"hi": "hello"}, "b"]
	//    data["foo.args[0]"] = "a"
	//    data["foo.args[1].hi"] = "hello"
	//
	const res: Record<string, any> = { ...data }
	const walk = (obj: any, path: string[] = [], depth = 0) => {
		if (depth > max) return
		if (Array.isArray(obj)) {
			for (let i = 0; i < obj.length; i++) {
				const val = obj[i]
				if (typeof val === 'object' && val !== null) {
					walk(val, path.concat(`[${i}]`), depth + 1)
				} else {
					res[path.concat(`[${i}]`).join('')] = val
				}
			}
		} else {
			for (const key in obj) {
				const val = obj[key]
				res[path.concat(path.length > 0 ? `.${key}` : `${key}`).join('')] = val
				if (typeof val === 'object' && val !== null) {
					walk(val, path.concat(path.length > 0 ? `.${key}` : `${key}`), depth + 1)
				}
			}
		}
	}
	walk(data)
	return res
}

export const Bind = (v: any, data: Record<string, any>): any => {
	data = data || {}
	if (typeof v === 'string') {
		v = v.trim()
		// "{{ foo }}"
		if (v.startsWith('{{') && v.endsWith('}}')) {
			const match = v.match(/\{\{(.+?)\}\}/)
			if (match) {
				const key = match[1].trim()
				return data[key]
			}
		}

		// "Hello {{ foo }}"
		return v.replace(/\{\{(.+?)\}\}/g, (match: any, key: string) => {
			return data[key.trim()]
		})
	}

	if (Array.isArray(v)) {
		return v.map((item: any) => Bind(item, data))
	}

	if (typeof v === 'object') {
		const res: Record<string, any> = {}
		for (const key in v) {
			res[key] = Bind(v[key], data)
		}
		return res
	}

	return v
}
