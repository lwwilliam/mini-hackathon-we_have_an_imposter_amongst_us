import React, { useEffect, useRef, useState } from 'react';
import {
  Job,
  JobMode,
  JobType,
  Qualification,
  QualPriority,
} from '../../types.ts';
import Modal from '../../components/Modal.tsx';

const emptyJob: Job = {
  title: '',
  mode: JobMode.Remote,
  type: JobType.FullTime,
  position: '',
  location: '',
  description: '',
  qualifications: {
    pastExperience: [],
    technical: [],
    soft: [],
  },
  responsibilities: [],
};

const testJob: Job = {
  title: 'Product Engineer [PHP]',
  mode: JobMode.Remote,
  type: JobType.FullTime,
  position: 'Associate',
  location: 'Kuala Lumpur, Malaysia',
  description:
    'We are looking for a skilled, passionate, and highly motivated IT Product Engineer to involve in full Systems Development Life Cycle and provide support to the system users.\n\nWe require individuals who are strong believers in continuous improvement and are constantly driven to bring about positive change to processes.',
  qualifications: {
    pastExperience: [
      {
        name: 'Degree / Advanced Diploma in Computer Science or equivalent',
        priority: QualPriority.Mandatory,
        minYears: 0,
      },
    ],
    technical: [
      { name: 'Web Applications', priority: QualPriority.Normal, minYears: 0 },
      {
        name: 'RESTful APIs with JSON / XML',
        priority: QualPriority.Normal,
        minYears: 0,
      },
      { name: 'PHP V8', priority: QualPriority.Normal, minYears: 0 },
      { name: 'Scrum', priority: QualPriority.Bonus, minYears: 0 },
      {
        name: 'System Design & Software Implementation',
        priority: QualPriority.Normal,
        minYears: 5,
      },
    ],
    soft: [
      {
        name: 'Good communication skills',
        priority: QualPriority.Normal,
        minYears: 0,
      },
      { name: 'Team player', priority: QualPriority.Normal, minYears: 0 },
      { name: 'Problem solver', priority: QualPriority.Normal, minYears: 0 },
    ],
  },
  responsibilities: [
    'Involve in R&D, design, implementation, integration, testing and deployment of software applications',
    'Conducts, leads and coordinates a specific application module development activity',
    'Provides technical experties and guidance to the development team',
  ],
};

interface JobDescriptionModalProps {
  job: Job;
  open: boolean;
  onClose: () => void;
}

interface JobDescriptionCardProps {
  job: Job;
  onClick: () => void;
}

interface QualificationBeanProps {
  qualification: Qualification;
}

const QualificationBean: React.FC<QualificationBeanProps> = ({
  qualification,
}) => {
  let c = 'white';

  if (qualification.priority === QualPriority.Mandatory) {
    c = '#FFCECE';
  } else if (qualification.priority === QualPriority.Bonus) {
    c = '#D8FFCE';
  }

  return qualification.minYears ? (
    <div
      className={`flex flex-row h-10 w-fit mr-2 mb-2 space-x-2 justify-center items-center bg-[${c}] border-[#57116F] border-[1px] rounded-full text-md px-5 py-1 text-center`}
    >
      <div className="text-md font-bold text-[#57116F]">{`${qualification.minYears}y+`}</div>
      <div>{qualification.name}</div>
    </div>
  ) : (
    <div
      className={`h-10 w-fit mr-2 mb-2 justify-center items-center bg-[${c}] border-[#57116F] border-[1px] rounded-full text-md px-5 py-1 text-center`}
    >
      {qualification.name}
    </div>
  );
};

const ResponsibilityListItem = ({ content, onChange, onDelete }) => {
  return (
    <li>
      <div className="flex flex-row justify-between w-full">
        <textarea className="w-4/5" value={content} onChange={onChange} />
        <img
          src="/minus.png"
          className="w-8 h-8 transition duration-300 ease-in-out hover:rotate-180"
          onClick={onDelete}
        />
      </div>
    </li>
  );
};

const JobDescriptionModal: React.FC<JobDescriptionModalProps> = ({
  job,
  open,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [jobState, updateJobState] = useState(job);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleAddResponsibilityListItem = () => {
    const newResponsibilities = jobState.responsibilities.slice();
    newResponsibilities.push('');
    updateJobState({ ...jobState, responsibilities: newResponsibilities });
  };

  const handleDeleteResponsibilityListItem = (index) => {
    const newResponsibilities = jobState.responsibilities.filter(
      (_, i) => i !== index
    );
    console.log(newResponsibilities);
    updateJobState({ ...jobState, responsibilities: newResponsibilities });
  };

  useEffect(() => {
    updateJobState(job);
  }, [job]);

  useEffect(() => {
    open
      ? document.addEventListener('mousedown', handleClickOutside)
      : document.removeEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <Modal open={open}>
      <div
        ref={modalRef}
        className="bg-white rounded-lg h-[50rem] w-[80rem] flex flex-col py-5 px-8 space-y-5 overflow-auto"
      >
        <input
          id="job-title"
          placeholder="Job Title"
          className="h-10 text-3xl font-bold"
          value={jobState.title}
          onChange={(e) =>
            updateJobState({ ...jobState, title: e.target.value })
          }
        />
        <div className="flex flex-row space-x-4">
          <select
            className=" bg-white border-[#57116F] border-[1px] rounded-full px-3 py-1"
            value={jobState.mode}
            onChange={(e) =>
              updateJobState({ ...jobState, mode: e.target.value as JobMode })
            }
          >
            <option value={JobMode.Onsite}>On-Site</option>
            <option value={JobMode.Remote}>Remote</option>
            <option value={JobMode.Hybrid}>Hybrid</option>
          </select>
          <select
            className=" bg-white border-[#57116F] border-[1px] rounded-full px-3 py-1"
            value={jobState.type}
            onChange={(e) =>
              updateJobState({ ...jobState, type: e.target.value as JobType })
            }
          >
            <option value={JobType.FullTime}>Full Time</option>
            <option value={JobType.PartTime}>Part Time</option>
            <option value={JobType.Contract}>Contract</option>
          </select>
          <input
            id="job-position"
            placeholder="Position"
            className="bg-white border-[#57116F] border-[1px] rounded-full px-3 py-1"
            value={jobState.position}
            onChange={(e) =>
              updateJobState({ ...jobState, position: e.target.value })
            }
          />
          <input
            id="job-location"
            placeholder="Location"
            className="bg-white border-[#57116F] border-[1px] rounded-full px-3 py-1"
            value={jobState.location}
            onChange={(e) =>
              updateJobState({ ...jobState, location: e.target.value })
            }
          />
        </div>
        <div id="job-desc-title" className="text-2xl font-bold">
          Job Description
        </div>
        <textarea
          id="job-desc"
          placeholder="Job Description"
          className="h-32 text-md min-h-32"
          value={jobState.description}
          onChange={(e) =>
            updateJobState({ ...jobState, description: e.target.value })
          }
        />
        <hr className="h-px my-8 bg-[#57116F] border-0" />
        <div className="flex flex-row w-full space-x-5">
          <div className="flex flex-col w-1/2 space-y-2">
            <div className="flex flex-row justify-between">
              <div
                id="job-responsibilities-title"
                className="text-2xl font-bold"
              >
                Responsibilities
              </div>
              <img
                src="/plus.png"
                className="w-8 h-8 transition duration-300 ease-in-out hover:rotate-90"
                onClick={handleAddResponsibilityListItem}
              />
            </div>
            <div id="responsibilities" className="pl-5">
              <ul className="list-disc space-y-2">
                {jobState.responsibilities.map((r, i) => (
                  <ResponsibilityListItem
                    key={i}
                    content={r}
                    onChange={(e) => {
                      const newResponsibilities =
                        jobState.responsibilities.slice();
                      newResponsibilities[i] = e.target.value;
                      updateJobState({
                        ...jobState,
                        responsibilities: newResponsibilities,
                      });
                    }}
                    onDelete={() => handleDeleteResponsibilityListItem(i)}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col w-1/2 space-y-2">
            <div className="flex flex-row justify-between items-center">
              <div id="qualifications-title" className="text-2xl font-bold">
                Qualifications
              </div>
              <div className="flex flex-row justify-normal space-x-4">
                <div className="flex flex-row justify-normal items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-[#FFCECE] border-[#57116F] border-[1px]"></div>
                  <div className="font-bold">Mandatory</div>
                </div>
                <div className="flex flex-row justify-normal items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-[#D8FFCE] border-[#57116F] border-[1px]"></div>
                  <div className="font-bold">Bonus</div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div id="education-title" className="text-xl font-bold">
                Education
              </div>
              <img
                src="/plus.png"
                className="w-8 h-8 transition duration-300 ease-in-out hover:rotate-90"
                onClick={() => {
                  console.log('Add new education');
                }}
              />
            </div>
            <div className="flex flex-wrap items-start">
              {jobState.qualifications.pastExperience.map((x, i) => (
                <QualificationBean key={i} qualification={x} />
              ))}
            </div>
            <div className="flex flex-row justify-between items-center">
              <div id="technical-skills-title" className="text-xl font-bold">
                Technical Skills
              </div>
              <img
                src="/plus.png"
                className="w-8 h-8 transition duration-300 ease-in-out hover:rotate-90"
                onClick={() => {
                  console.log('Add new technical');
                }}
              />
            </div>
            <div className="flex flex-wrap items-start">
              {jobState.qualifications.technical.map((x, i) => (
                <QualificationBean key={i} qualification={x} />
              ))}
            </div>
            <div className="flex flex-row justify-between items-center">
              <div id="soft-skills-title" className="text-xl font-bold">
                Soft Skills
              </div>
              <img
                src="/plus.png"
                className="w-8 h-8 transition duration-300 ease-in-out hover:rotate-90"
                onClick={() => {
                  console.log('Add new soft');
                }}
              />
            </div>
            <div className="flex flex-wrap items-start">
              {jobState.qualifications.soft.map((x, i) => (
                <QualificationBean key={i} qualification={x} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const JobDescriptionCard: React.FC<JobDescriptionCardProps> = ({
  job,
  onClick,
}) => {
  const details = [job.mode, job.type, job.position].join(', ');
  const skills = job.qualifications.technical
    .slice(0, 3)
    .map((q) => q.name)
    .join(', ')
    .concat(`, +${job.qualifications.technical.length}`);

  return (
    <div
      id={job.title}
      className="flex flex-col bg-white w-[20rem] h-[13rem] rounded-xl p-5
    transition duration-300 ease-in-out hover:shadow-xl hover:scale-105"
      onClick={onClick}
    >
      <div id="title" className="text-xl font-bold text-center pb-5">
        {job.title}
      </div>
      <div className="flex flex-row pl-2 pb-5 items-center">
        <img src="/bag.png" className="w-8 h-8" />
        <div id="details" className="pl-3 text-medium">
          {details}
        </div>
      </div>
      <div className="flex flex-row pl-2 items-center">
        <img src="/list.png" className="w-8 h-8" />
        <div id="skills-summary" className="text-medium pl-3">
          {skills}
        </div>
      </div>
    </div>
  );
};

const JobDescriptions = () => {
  const [currentJobDesc, setCurrentJobDesc] = useState<Job>(emptyJob);
  const [modalState, setModalState] = useState(false);

  const openJobDescriptionModal: (job: Job) => void = (job) => {
    setCurrentJobDesc(job);
    setModalState(true);
  };

  return (
    <div
      id="main"
      className="bg-gradient-to-b from-[#E8E8E8] to-[#F4D2FF] w-screen h-screen flex flex-col"
    >
      <div id="header" className="bg-black/60 w-screen h-16 flex"></div>
      <div id="body" className="flex flex-col mx-32">
        <div id="body-header" className="flex flex-row justify-between py-12">
          <div
            id="title"
            className="text-6xl items-center text-center font-[700]"
          >
            <span className="bg-gradient-to-r from-[#57116F] to-[#A720D4] bg-clip-text text-transparent">
              Job Descriptions
            </span>
          </div>
          <div className="flex flex-row justify-normal items-center">
            <input
              id="search-bar"
              type="text"
              placeholder="Search"
              className="w-[25rem] h-10 justify-center align-middle bg-white border-[#57116F] border-2 rounded-full
            pl-5"
            />
            <div
              id="filter"
              className="flex flex-col ml-5 w-20 h-10 bg-[#57116F] rounded-full
            justify-center text-center text-white transition duration-150 ease-in-out
            hover:-translate-y-2"
            >
              Filter
            </div>
            <div
              id="new"
              className="flex flex-col ml-5 w-20 h-10 bg-[#57116F] rounded-full
            justify-center text-center text-white transition duration-150 ease-in-out
            hover:-translate-y-2"
            >
              New
            </div>
          </div>
        </div>
        <div id="body-body" className="grid grid-rows-3 grid-cols-4 gap-5">
          <JobDescriptionCard
            job={testJob}
            onClick={() => openJobDescriptionModal(testJob)}
          />
        </div>
      </div>
      <JobDescriptionModal
        job={currentJobDesc}
        open={modalState}
        onClose={() => setModalState(false)}
      />
    </div>
  );
};

export default JobDescriptions;
