enum QualPriority {
  Normal = 'normal',
  Mandatory = 'mandatory',
  Bonus = 'bonus',
}

enum JobMode {
  Onsite = 'On Site',
  Remote = 'Remote',
  Hybrid = 'Hybrid',
}
enum JobType {
  FullTime = 'Full Time',
  PartTime = 'Part Time',
  Contract = 'Contract',
}

type Qualification = {
  name: string;
  priority: QualPriority;
  minYears: number;
};

type Job = {
  title: string;
  mode: JobMode;
  type: JobType;
  position: string;
  location: string;
  description: string;
  qualifications: {
    pastExperience: Qualification[];
    technical: Qualification[];
    soft: Qualification[];
  };
  responsibilities: string[];
};

export { Job, JobMode, JobType, Qualification, QualPriority };
