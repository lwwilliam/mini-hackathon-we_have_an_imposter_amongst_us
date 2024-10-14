import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {Job, Qualification, QualPriority} from '../../types.ts'
import Modal from '../../components/Modal.tsx'

const job: Job = {
	title: "Product Engineer [PHP]",
	mode: "Remote",
	type: "Full time",
	position: "Associate",
	location: "Kuala Lumpur, Malaysia",
	description: "",
	qualifications: {
		education: [
			{ name: "Degree / Advanced Diploma in Computer Science or equivalent", priority: QualPriority.Mandatory }
		],
		technical: [
			{ name: "Web Applications", priority: QualPriority.Normal },
			{ name: "RESTful APIs with JSON / XML", priority: QualPriority.Normal },
			{ name: "PHP V8", priority: QualPriority.Normal },
			{ name: "Scrum", priority: QualPriority.Bonus }
		],
		soft: [
			{ name: "Good communication skills", priority: QualPriority.Normal },
			{ name: "Team player", priority: QualPriority.Normal },
			{ name: "Problem solver", priority: QualPriority.Normal }
		]
	},
	responsibilities: [
		"Involve in R&D, design, implementation, integration, testing and deployment of software applications",
		"Conducts, leads and coordinates a specific application module development activity",
		"Provides technical experties and guidance to the development team",
	]
}

interface JobDescriptionModalProps {
	job: Job
	open: boolean
	onClose: () => void
}

const JobDescriptionModal = ({job, open, onClose}) => {

	const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

	useEffect(() => {
		open ? document.addEventListener('mousedown', handleClickOutside) 
			: document.removeEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [open])

	return (
		<Modal open={open}>
			<div ref={modalRef} className='bg-white rounded-lg h-[35rem] w-[30rem] md:h-[50rem] md:w-[50rem] flex flex-col justify-center items-center overflow-auto'>
				Hello from modal!
			</div>
		</Modal>
	)
}

interface JobDescriptionCardProps {
	job: Job
	onClick: () => void
}

const JobDescriptionCard: React.FC<JobDescriptionCardProps> = ({job, onClick}) => {

	const details = [job.mode, job.type, job.position].join(", ")
	const skills = job.qualifications.technical.slice(0, 3).map((q) => q.name).join(", ").concat(`, +${job.qualifications.technical.length}`)

	return (
		<div id={job.title} className='flex flex-col bg-white w-[20rem] h-[13rem] rounded-xl p-5
		transition duration-300 ease-in-out hover:shadow-xl hover:scale-105'
		onClick={onClick}
		>
			<div id="title" className='text-xl font-bold text-center pb-5'>{job.title}</div>
			<div className='flex flex-row pl-2 pb-5 items-center'>
				<img src='/bag.png' className='w-8 h-8'/>
				<div id="details" className='pl-3 text-medium'>{details}</div>
			</div>
			<div className='flex flex-row pl-2 items-center'>
				<img src='/list.png' className='w-8 h-8'/>
				<div id="skills-summary" className='text-medium pl-3'>{skills}</div>
			</div>
		</div>
	)
}

const JobDescriptions = () => {

	const [currentJobDesc, setCurrentJobDesc] = useState<Job | null>(null);
	const [modalState, setModalState] = useState(false);

	const openJobDescriptionModal: (job: Job) => void = (job) => {
		setCurrentJobDesc(job)
		setModalState(true)
	}

  return (
    <div id="main" className='bg-gradient-to-b from-[#E8E8E8] to-[#F4D2FF] w-screen h-screen flex flex-col'>
      <div id="header" className='bg-black/60 w-screen h-16 flex'>

			</div>
			<div id="body" className='flex flex-col mx-32'>
				<div id="body-header" className='flex flex-row justify-between py-12'>
					<div id="title" className='text-6xl items-center text-center font-[700]'>
						<span className='bg-gradient-to-r from-[#57116F] to-[#A720D4] bg-clip-text text-transparent'>
							Job Descriptions
						</span>
					</div>
					<div className='flex flex-row justify-normal items-center'>
						<input id='search-bar' type="text" placeholder="Search"
						className='w-[25rem] h-10 justify-center align-middle bg-white border-[#57116F] border-2 rounded-full
						pl-5'/>
						<div id="filter"
						className='flex flex-col ml-5 w-20 h-10 bg-[#57116F] rounded-full
						justify-center text-center text-white transition duration-150 ease-in-out
						hover:-translate-y-2'>
							Filter
						</div>
						<div id="new"
						className='flex flex-col ml-5 w-20 h-10 bg-[#57116F] rounded-full
						justify-center text-center text-white transition duration-150 ease-in-out
						hover:-translate-y-2'>
							New
						</div>
					</div>
				</div>
				<div id="body-body" className='grid grid-rows-3 grid-cols-4 gap-5'>
					<JobDescriptionCard job={job} onClick={() => openJobDescriptionModal(job)} />
				</div>
			</div>
			<JobDescriptionModal job={currentJobDesc} open={modalState} onClose={() => setModalState(false)} />
    </div>
  );
}

export default JobDescriptions;