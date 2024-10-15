import React, { useEffect, useRef, useState } from 'react';
import {
  Job,
  JobMode,
  JobType,
  Qualification,
  QualPriority,
} from '../../types';

import Modal from '../../components/Modal';
import { useLocation } from 'react-router-dom';


interface JobDescriptionModalProps {
  job: Job;
  open: boolean;
  onClose: (job: Job) => void;
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

interface ResponsibilityListItemProps {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDelete: () => void;
}

const ResponsibilityListItem: React.FC<ResponsibilityListItemProps> = ({ content, onChange, onDelete }) => {
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
  const [jobState, updateJobState] = useState<Job>(job);

  useEffect(() => {
    updateJobState(job);
  }, [job]);

  const handleClickOutside = async (event: MouseEvent) => {

    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      await onClose(jobState);
    }
  };

  const handleAddResponsibilityListItem = () => {
    const newResponsibilities = jobState.responsibilities.slice();
    newResponsibilities.push('');
    updateJobState({ ...jobState, responsibilities: newResponsibilities });
  };

  const handleDeleteResponsibilityListItem = (index: number) => {
    const newResponsibilities = jobState.responsibilities.filter(
      (_, i) => i !== index
    );
    console.log(newResponsibilities);
    updateJobState({ ...jobState, responsibilities: newResponsibilities });
  };

  useEffect(() => {
    open
      ? document.addEventListener('mousedown', handleClickOutside)
      : document.removeEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, jobState]);

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
                {jobState.responsibilities.map((r: string, i: number) => (
                  <ResponsibilityListItem
                  key={i}
                  content={r}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const newResponsibilities = jobState.responsibilities.slice();
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

export {JobDescriptionModal}