type monthsLong =
	| 'January'
	| 'Febuary'
	| 'March'
	| 'April'
	| 'May'
	| 'June'
	| 'July'
	| 'August'
	| 'September'
	| 'October'
	| 'November'
	| 'December'
type monthsShort =
	| 'Jan'
	| 'Feb'
	| 'Mar'
	| 'Apr'
	| 'May'
	| 'Jun'
	| 'Jul'
	| 'Aug'
	| 'Sep'
	| 'Oct'
	| 'Nov'
	| 'Dec'

interface issueApiErr {
	path: Array<string>
	message: string
}

interface apiErr {
	message: string
	errors: {
		issues: Array<issueApiErr>
	}
}

interface errorBagType {
	[key: string]: string
}
