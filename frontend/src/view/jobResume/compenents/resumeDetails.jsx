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
        highlights.map((val, index) => 
        <li key={index} className="list-item">{val}</li>) 
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

const ResumeDetails = ({viewing}) => {
  return (
    <div
    className="flex flex-col flex-1 bg-white rounded-xl p-10 gap-5"
    >
      {
        (viewing) ? (<>
          <div
          className="flex justify-between"
          >
            <h1 className="font-light text-6xl place-content-center">{viewing.name}</h1>
            <div className="flex gap-2 items-center">
              <DownloadPDF />
              <DownloadAnalysis />
            </div>
          </div>
          <div className="flex flex-col overflow-auto gap-5">
            <ResumeSummary summary={viewing.summary}/>
            <ResumeHighlights highlights={viewing.highlights}/>
            <QualificationMatched qualifications={viewing.qualifications}/>
          </div>
        </>) : (<div>Loading Data...</div>)
      }
    </div>
  )
}

export default ResumeDetails