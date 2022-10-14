export const getFormJson = (form: HTMLFormElement) => {
	const jsondata: any = {}
	const formdata = new FormData(form)

	formdata.forEach((value, key) => {
		if (!jsondata[key]) {
			jsondata[key] =
				formdata.getAll(key).length > 1 ? formdata.getAll(key) : formdata.get(key)
		}
	})

	return jsondata
}
