export enum ViewMode {
	Hour = 'Hour',
	QuarterDay = 'Quarter Day',
	HalfDay = 'Half Day',
	Day = 'Day',
	Week = 'Week',
	Month = 'Month',
	QuarterYear = 'QuarterYear',
	Year = 'Year'
}

export interface DisplayOption {
	viewMode?: ViewMode
	viewDate?: Date
	preStepsCount?: number
	locale?: string
	rtl?: boolean
}

export interface DateSetup {
	dates: Date[]
	viewMode: ViewMode
}
