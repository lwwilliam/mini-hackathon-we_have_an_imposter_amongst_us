import React from "react";
import { QualPriority } from "../../../constants";

const CheckBox = ({on}) => {
  return (
    <div className={`border-solid border-2 flex ${on ? "bg-green-100 border-green-500" : "bg-red-500 border-red-900"} aspect-square h-full rounded-xl place-items-center`}>
      <span className={`text-center flex-1 ${on ? 'text-green-700' : 'text-white text-xl'}`}>
        {on ? "✔": "X"}
      </span>
    </div>
  )
}

const QualificationBean = ({
  qualification,
}) => {
  let c = 'white';

  if (qualification.priority === QualPriority.Mandatory) {
    c = '#FFCECE';
  } else if (qualification.priority === QualPriority.Bonus) {
    c = '#D8FFCE';
  }

  return (
  <div className="flex gap-5">
    <div className="flex-1">
    {qualification.minYears ? (
        <div
          className={`flex flex-row h-10 w-fit space-x-2 justify-center items-center bg-[${c}] border-[#57116F] border-[1px] rounded-full text-md px-5 py-1 text-center`}
        >
          <div className="text-md font-bold text-[#57116F]">{`${qualification.minYears}y+`}</div>
          <div className="text-ellipsis overflow-hidden whitespace-nowrap">{qualification.name}</div>
        </div>
      ) : (
        <div
          className={`
            h-10 w-fit justify-center items-center bg-[${c}] 
            border-[#57116F] border-[1px] rounded-full text-md px-5 py-1 text-center
            text-ellipsis overflow-hidden whitespace-nowrap
            `}
        >
          {qualification.name}
        </div>
      )}
    </div>
      <CheckBox on={qualification.qualified}/>
  </div>);
};

const ResumeSummary = ({summary}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl">Resume Summary</h1>
      <p>
        {summary}
      </p>
    </div>
  )
}

const TechnicalSkillMatched = ({ matched }) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl">Technical Skills</h1>
      <div className="flex flex-col gap-2">
        { matched.map((val, index) => <QualificationBean key={index} qualification={val} />) }
      </div>
    </div>
  )
}

const ExperienceMatched = ({ matched }) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl">Experiences</h1>
      <div className="flex flex-col gap-2">
        { matched.map((val, index) => <QualificationBean key={index} qualification={val} />) }
      </div>
    </div>
  )
}

const SoftSkillMatched = ({ matched }) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl">Soft Skils</h1>
      <div className="flex flex-col gap-2">
        { matched.map((val, index) => <QualificationBean key={index} qualification={val} />) }
      </div>
    </div>
  )
}

const QualificationMatched = ({ qualifications }) => {
  return (
  <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <h1 className="text-3xl">Qualification Method</h1>
        <div className="flex gap-5">
          <div className="flex place-items-center gap-2">
            <div className="bg-[#FFCECE] rounded-full w-5 h-5 border-solid border-1 border-[#57116F]"></div>
            <span>Mandatory</span>
          </div>
          <div className="flex place-items-center gap-2">
            <div className="bg-[#D8FFCE] rounded-full w-5 h-5 border-solid border-1 border-[#57116F]"></div>
            <span>Bonus</span>
          </div>
        </div>
      </div>
      
      <ExperienceMatched matched={qualifications.pastExperience}/>
      <TechnicalSkillMatched matched={qualifications.technical}/>
      <SoftSkillMatched matched={qualifications.soft}/>
  </div>
  )
}

const ResumeHighlights = ({highlights}) => {
  return (
  <div className="flex flex-col gap-2">
      <h1 className="text-3xl">Candidate Highlights</h1>

      <ul className="list-disc list-inside">
        { 
        highlights.map((val) => 
        <li className="list-item">{val}</li>) 
        }
      </ul>
  </div>
  )
}

const DownloadPDF = () => {
  return (
    <button
    className='flex-1 bg-[#57116F] text-white px-5 py-2 whitespace-nowrap rounded-2xl'
  >Download PDF</button>
  )
}

const DownloadAnalysis = () => {
  return (
    <button
    className='flex-1 bg-[#57116F] text-white px-5 py-2 whitespace-nowrap rounded-2xl'
  >Download Analysis</button>
  )
}

const ResumeDetails = () => {

  const mockd = {
    name: "Lee William",
    summary: "Highly dependable and detail-oriented Toilet Washer with over [X] years of experience in maintaining cleanliness and sanitation in commercial, residential, and public facilities. Proficient in using cleaning products, disinfectants, and specialized equipment to ensure hygienic restroom environments. Strong understanding of health and safety standards, with a commitment to preventing the spread of bacteria and maintaining a clean, pleasant atmosphere for users. Adept at working efficiently in fast-paced environments, managing time well, and collaborating with janitorial teams to meet high cleanliness standards. Proven ability to handle multiple tasks, follow instructions precisely, and consistently achieve top-quality results.",
    highlights: ["Deep cleaning and sanitization", "Knowledge of cleaning products and disinfectants", "Compliance with health and safety protocols", "Teamwork and communication", "Time management and efficiency"],
    qualifications: {
      pastExperience: [
        {
          name: 'Degree / Advanced Diploma in Computer Science or equivalent',
          priority: QualPriority.Mandatory,
          minYears: 0,
          qualified: false,
        },
      ],
      technical: [
        { name: 'Web Applications', priority: QualPriority.Normal, minYears: 0, qualified: true },
        {
          name: 'RESTful APIs with JSON / XML',
          priority: QualPriority.Normal,
          minYears: 0,
          qualified: false,
        },
        { name: 'PHP V8', priority: QualPriority.Normal, minYears: 0,
          qualified: false, },
        { name: 'Scrum', priority: QualPriority.Bonus, minYears: 0,
          qualified: false, },
        {
          name: 'System Design & Software Implementation',
          priority: QualPriority.Normal,
          minYears: 5,
          qualified: false,
        },
      ],
      soft: [
        {
          name: 'Good communication skills',
          priority: QualPriority.Normal,
          minYears: 0,
          qualified: true,
        },
        { name: 'Team player', priority: QualPriority.Normal, minYears: 0,
          qualified: false, },
        { name: 'Problem solver', priority: QualPriority.Normal, minYears: 0,
          qualified: true, },
      ],
    }
  }

  return (
    <div
    className="flex flex-col flex-1 bg-white rounded-xl p-10 gap-5"
    >
      <div
      className="flex justify-between"
      >
        <h1 className="font-light text-6xl place-content-center">{mockd.name}</h1>
        <div className="flex gap-2 items-center">
          <DownloadPDF />
          <DownloadAnalysis />
        </div>
      </div>
      <div className="flex flex-col overflow-auto gap-5">
        <ResumeSummary summary={mockd.summary}/>
        <ResumeHighlights highlights={mockd.highlights}/>
        <QualificationMatched qualifications={mockd.qualifications}/>
      </div>
    </div>
  )
}

export default ResumeDetails