export default (type: string) => {
	if (type === 'RangePicker') return 'auto'
	if (type === 'Upload') return 405

	return 240
}
