import React, { useEffect, useRef, useState } from 'react';
import { QualPriority, JobMode, JobType } from '../../constants';
import { JobDescriptionModal } from './jobDescriptionModal.jsx'
import UploadPDFModal from '../../components/pdfUpload/uploadPdf';
import { useNavigate } from 'react-router-dom';

const emptyJob = {
  _id: '',
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

const JobDescriptionCard = ({
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

const updateJobDesc = async (job) => {

  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateJobDescription`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job),
  });

  await response.json();

  console.log(response)

  if (!response.ok) {
    throw new Error('Failed to update job description');
  }
}

const getJobDescs = async (setter) => {

  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllJobDescriptions`)


  if (!response.ok) {
    throw new Error("Failed to fetch job descriptions")
  }

  const data = await response.json();
  console.log(response)
  setter(data);
  console.log("Data gotten and saved")
}


const JobDescriptions = () => {
  const nav = useNavigate()
  const [allJobDescriptions, setJobDescriptions] = useState([]);
  const [currentJobDesc, setCurrentJobDesc] = useState(emptyJob);
  const [modalState, setModalState] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const editButtonRef = useRef(null);
  const [jdmodelState, setJdModalState] = useState(false)

  useEffect(() => {
    getJobDescs(setJobDescriptions);
  }, []);

  useEffect(() => {

    if (currentJobDesc._id) {
      setModalState(true);
    }
  }, [currentJobDesc])

  useEffect(() => {

    if (isEditing) {
      editButtonRef.current.style.backgroundColor = '#FF3737';
      editButtonRef.current.style.width = '7rem';
    } else {
      editButtonRef.current.style.backgroundColor = '#57116F';
      editButtonRef.current.style.width = '5rem';
    }

  }, [isEditing])

  const openUploadPDFModal = () => {
    setJdModalState(true)
  }

  return (
    <div
      id="main"
      className="bg-gradient-to-b from-[#E8E8E8] to-[#F4D2FF] w-screen h-screen flex flex-col"
    >
      <UploadPDFModal open={jdmodelState} onClose={() => setJdModalState(false)} apiURL={`${process.env.REACT_APP_BACKEND_URL}/api/parseJD`}/>
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
            hover:-translate-y-2 cursor-pointer"
            >
              Filter
            </div>
            <div
              id="edit"
              ref={editButtonRef}
              className="flex flex-col ml-5 w-20 h-10 bg-[#57116F] rounded-full
            justify-center text-center text-white transition duration-150 ease-in-out
            hover:-translate-y-2 cursor-pointer"
            onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Stop Editing' : 'Edit'}
            </div>
            <div
              id="new"
              className="flex flex-col ml-5 w-20 h-10 bg-[#57116F] rounded-full
            justify-center text-center text-white transition duration-150 ease-in-out
            hover:-translate-y-2 cursor-pointer"
            onClick={openUploadPDFModal}
            >
              New
            </div>
          </div>
        </div>
        <div id="body-body" className="grid grid-rows-3 grid-cols-4 gap-5">
          {
            allJobDescriptions.map((job, i) => (
              <JobDescriptionCard
                key={i}
                job={job}
                onClick={() =>{
                  if (isEditing) {
                    setCurrentJobDesc(job);
                  } else {
                    nav("/job/analysis")
                  }
                }}
              />
            ))
          }
        </div>
      </div>
      <JobDescriptionModal
        job={currentJobDesc}
        open={modalState}
        onClose={async (job) => {
          await updateJobDesc(job);
          await getJobDescs(setJobDescriptions);
          setModalState(false)
        }}
      />
    </div>
  );
};

export default JobDescriptions;
