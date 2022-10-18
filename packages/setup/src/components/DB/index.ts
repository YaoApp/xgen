import { onMount } from 'svelte'

import { api, metadata_connector, metadata_connector_options } from '../../app.config'
import { steps } from '../../store'
import { getFormJson } from '../../utils'
import DynamicValue from '../DynamicValue/index.svelte'

let type: string = 'mysql'
let info: string = ''

const getSqlType = (form: HTMLFormElement) => {
	type = getFormJson(form).type
}

const preventDefault = (e: SubmitEvent) => {
	e.preventDefault()
}

onMount(() => {
	const form = document.getElementById('form_db')! as HTMLFormElement

	form.addEventListener('change', () => getSqlType(form))
	form.addEventListener('submit', (e) => preventDefault(e))

	return () => {
		form.removeEventListener('change', (e) => getSqlType(form))
		form.removeEventListener('submit', (e) => preventDefault(e))
	}
})

const check = async () => {
	const form = document.getElementById('form_db')! as HTMLFormElement

	if (!form.checkValidity()) return

	const res = await fetch(api.check, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(getFormJson(form))
	})

	if (res.status !== 200) {
		const target = await res.json().catch(() => {})

		info = `测试连接失败，失败原因:${target?.message || '无'}`

		return
	}

	info = '测试连接成功!'
}

const setup = async () => {
	const form_env = document.getElementById('form_env')! as HTMLFormElement
	const form_db = document.getElementById('form_db')! as HTMLFormElement

	if (!form_db.checkValidity()) return

	steps.set(3)

	const res = await fetch(api.setup, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify({
			env: getFormJson(form_env),
			db: getFormJson(form_db)
		})
	})

	if (res.status !== 200) {
		const target = await res.json().catch(() => {})

		info = `Setup失败，失败原因:${target?.message || '无'}`

		steps.set(2)

		return
	}

	steps.set(4)

	info = 'Setup成功!'
}
