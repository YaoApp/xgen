import { onMount } from 'svelte'

import { api, metadata_connector, metadata_connector_options } from '../../app.config'
import { steps } from '../../store'
import { getFormJson } from '../../utils'
import DynamicValue from '../DynamicValue/index.svelte'

let type: string = 'mysql'

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

const test = async () => {
	const form = document.getElementById('form_db')! as HTMLFormElement

	if (!form.checkValidity()) return

	const res = await fetch(api.test, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(getFormJson(form))
	})

	console.log(res)
}

const save = async () => {
	const form_env = document.getElementById('form_env')! as HTMLFormElement
	const form_db = document.getElementById('form_db')! as HTMLFormElement

	if (!form_db.checkValidity()) return

	const res = await fetch(api.save, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify({
			env: getFormJson(form_env),
			db: getFormJson(form_db)
		})
	})
}
