enum QualPriority {
	Normal,
	Mandatory,
	Bonus,
}

type Qualification = {
	name: string
	priority: QualPriority
}

type Job = {
	title: string,
	mode: string,
	type: string,
	position: string,
	location: string,
	description: string,
	qualifications: {
		education: Qualification[],
		technical: Qualification[],
		soft: Qualification[]
	},
	responsibilities: string[]
}

export {Job, Qualification, QualPriority};