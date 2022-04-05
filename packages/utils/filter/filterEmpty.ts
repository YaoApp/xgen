export default (v: any) => {
	if (!v) return {}

	for (const key in v) {
		if (v[key] === null || v[key] === '' || v[key] === undefined) {
			delete v[key]
		}
	}

	return v
}
