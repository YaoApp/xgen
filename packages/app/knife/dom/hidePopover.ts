const Index = (id?: string) => {
	const td_popover = document.getElementById(id || 'td_popover')

	if (!td_popover) return

	td_popover.parentElement?.remove()
}

export default Index
