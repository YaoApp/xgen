export default () => {
	const modal_container = document.createElement('div')

	modal_container.id = '__modal_container'

	document.body.appendChild(modal_container)

	return modal_container
}
