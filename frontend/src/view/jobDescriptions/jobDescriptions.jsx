import React, { useEffect, useRef, useState } from 'react';
import { QualPriority, JobMode, JobType } from '../../constants';
import { JobDescriptionModal } from './jobDescriptionModal.jsx'
import { useNavigate } from 'react-router-dom';


import JDUploader from '../../components/JDUploader/JDUploader.jsx';
import PageHeader from '../../components/pageHeader/Header.jsx';

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

  const skills = [job.qualifications.technical, job.qualifications.soft]
    .slice(0, 3)
    .map((q) => q.name)
    .join(', ')
    .concat(`, +${job.qualifications.technical.length + job.qualifications.soft.length}`);

  return (
    <div
      id={job.title}
      className="flex flex-col bg-white h-auto rounded-xl p-5
    transition duration-300 ease-in-out hover:shadow-xl hover:scale-105 overflow-auto"
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


const getAllTags = async (setter) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllTags`)

  if (!response.ok) {
    throw new Error("Failed to fetch tags")
  }

  const data = await response.json();
  
  setter(data);

}


const getJobDescs = async (setter) => {

  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllJobDescriptions`)

  if (!response.ok) {
    throw new Error("Failed to fetch job descriptions")
  }

  const data = await response.json();
  setter(data);
}


const JobDescriptions = () => {
  const nav = useNavigate()
  const [allJobDescriptions, setJobDescriptions] = useState([]);
  const [currentJobDesc, setCurrentJobDesc] = useState(emptyJob);
  const [modalState, setModalState] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [results, setResults] = useState([]);
  
  const editButtonRef = useRef(null);

  const filterButtonRef = useRef(null);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const [tags, setTags] = useState([]);

  const [jdmodelState, setJdModalState] = useState(false)

  useEffect(() => {
    getAllTags(setTags);

    getJobDescs(setJobDescriptions);
  }, []);

  useEffect(() => {
    setResults(allJobDescriptions)
  }, [allJobDescriptions])

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

  const filterByName = (query) => {
    const filteredData = allJobDescriptions.filter((job) => job.title.toLowerCase().includes(query.toLowerCase()));

    return (filteredData.length == 0) ? allJobDescriptions : filteredData;
  };

  const handleSearchInputChange = (e) => {
    const inputValue = e.target.value;
    setResults(filterByName(inputValue));
  };

  const handleFilterClick = () => {
    if (filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 15,
        right: window.innerWidth - rect.right,
      });
    }
    setFilterDropdown(!filterDropdown);

  };

  const handleFilterOptionClick = (tag) => {

    console.log("Filtering by tag: ", tag.tag_name)
    console.log(allJobDescriptions)

    setResults(allJobDescriptions.filter((job) => job.tags ? job.tags.includes(tag._id) : false));
  }

  useEffect(() => {

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !filterButtonRef.current.contains(e.target)) {
        setFilterDropdown(false);
      }
    }

    if (filterDropdown) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };

  }, [filterDropdown])


  return (
    <div
      id="main"
      className="w-screen h-screen flex flex-col"
    >
      <div className="-z-10 bg-gradient-to-b from-[#E8E8E8] to-[#F4D2FF] w-screen h-screen fixed"></div>
      <JDUploader 
      open={jdmodelState} 
      onClose={
        async () => {
          await getJobDescs(setJobDescriptions);
          setJdModalState(false)
        }}
      />
      <PageHeader />
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
              onChange={handleSearchInputChange}
            />
            <div
              id="filter"
              ref={filterButtonRef}
              className="flex flex-col ml-5 w-20 h-10 bg-[#57116F] rounded-full
            justify-center text-center text-white transition duration-150 ease-in-out
            hover:-translate-y-2 cursor-pointer"
            onClick={handleFilterClick}
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
            results.map((job, i) => (
              <JobDescriptionCard
                key={i}
                job={job}
                onClick={() =>{
                  if (isEditing) {
                    setCurrentJobDesc(job);
                  } else {
                    nav(`/job/${job._id}/analysis`)
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
        onClose={async () => {
          await getJobDescs(setJobDescriptions);
          setModalState(false)
        }}
      />
      {
      filterDropdown && (
          <div ref={dropdownRef} className='bg-white rounded-lg fixed z-50 space-y-2 p-2'
          style={{ top: `${dropdownPosition.top}px`, right: `${dropdownPosition.right}px` }}>
          <div className="flex flex-row justify-between items-center w-40 h-fit pl-5 hover:text-fuchsia-500 cursor-pointer"
            onClick={() => {
              setResults(allJobDescriptions);
            }}>
              All
          </div>
          {
            tags.map((tag, i) => {
              return (
                  <div key={i} className="flex flex-row justify-between items-center w-40 h-fit pl-5 hover:text-fuchsia-500 cursor-pointer"
                  onClick={() => {
                    setFilterDropdown(false)
                    handleFilterOptionClick(tag)
                    }}>
                    {tag.tag_name}
                  </div>
                )
              
              })
            }
          </div>
        )
      }
    </div>
    
  );
};

export default JobDescriptions;
