export const taskXCoordinate = (xDate: Date, dates: Date[], columnWidth: number) => {
	const index = dates.findIndex((d) => d.getTime() >= xDate.getTime()) - 1

	const remainderMillis = xDate.getTime() - dates[index].getTime()
	const percentOfInterval = remainderMillis / (dates[index + 1].getTime() - dates[index].getTime())
	const x = index * columnWidth + percentOfInterval * columnWidth

	return x
}

export const taskXCoordinateRTL = (xDate: Date, dates: Date[], columnWidth: number) => {
	let x = taskXCoordinate(xDate, dates, columnWidth)
	x += columnWidth
	return x
}

export const taskYCoordinate = (index: number, rowHeight: number, taskHeight: number) => {
	const y = index * rowHeight + (rowHeight - taskHeight) / 2
	return y
}
