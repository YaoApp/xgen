import { onMount } from 'svelte'

import { metadata_env } from '../../app.config'
import { steps } from '../../store'
import { getFormJson } from '../../utils'
import DynamicValue from '../DynamicValue/index.svelte'

const preventDefault = (e: SubmitEvent) => {
      e.preventDefault()
}

onMount(() => {
	const form = document.getElementById('form_env')! as HTMLFormElement

	form.addEventListener('submit', (e) => preventDefault(e))

	return () => {
		form.removeEventListener('submit', (e) => preventDefault(e))
	}
})

const next = () => {
      const form = document.getElementById('form_env')! as HTMLFormElement
      
	if (!form.checkValidity()) return

	steps.set(2)
}
