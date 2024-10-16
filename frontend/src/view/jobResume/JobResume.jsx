import React, { useEffect, useState } from "react";

import ResumeDetails from "./compenents/resumeDetails";

import PageHeader from "../../components/pageHeader/Header.jsx";
import { useParams } from "react-router-dom";

const CandidateDetails = ({ tableData, maxValue, onRowClick }) => {
  const TableRowData = ({name, matched, onClick}) => {
    return (
      <div className='grid grid-cols-3 py-2 border-b-2 border-solid border-[#E6E6E6]' onClick={onClick}>
        <p>{name}</p>
        <p className='col-span-2 text-ellipsis overflow-hidden whitespace-nowrap'>{matched}</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-2 font-medium'>
      <div className='flex flex-col overflow-hidden flex-1 rounded-xl'>
        <div className='grid grid-cols-3 text-center bg-[#57116F] text-white py-1'>
          <div>Candidate Name</div>
          <div className='col-span-2'>Qualication Matched</div>
        </div>

        {
          (tableData) ? (
            <div className='grid grid-rows-5 overflow-auto text-center flex-1 bg-white border-collapse'>
              { tableData.map((val, index) => 
              <TableRowData 
              key={index} 
              name={val.name} 
              matched={`${val.matched} / ${maxValue}`} 
              onClick={onRowClick(index)}
              />) }
            </div>
          ) : (
            <div className="flex-1">
              Data is Loading...
            </div>
          )
        }
      </div>
    </div>

  )
}

const JobResume = () => {
  const { jobid } = useParams()
  const [ results, setResults ] = useState([])
  const [ viewing, setViewing ] = useState(undefined)
  const [ title, setTitle ] = useState("Loading...")
  const [ tableData, setTableData ] = useState(undefined)
  const [ maxQua, setMaxQua ] = useState(0)

  console.log(jobid)

  const getQualifications = (qualifyObject) => [qualifyObject.pastExperience, qualifyObject.soft, qualifyObject.technical]
  
  const onTableRowClick = (index) => () => {
    setViewing(results[index])
  }

  const getJobData = async () => {
    const jobRequest = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getJobDescription?id=${jobid}`)
    const jobResponse = await jobRequest.json()

    console.log(jobResponse)
    setTitle(`Resume Matched for ${jobResponse.title}`)
    const qualificationArray = getQualifications(jobResponse.qualifications)
    const noQualify = qualificationArray.reduce((acc, value) => acc + value.length, 0)

    console.log(noQualify)
    setMaxQua(noQualify)
  }

  const getCandidateData = async () => {
    const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/job/analysis?id=${jobid}`)
    const response = await request.json()

    console.log(response)
    const newTableData = response.map((cand) => {
      const candidateQualification = getQualifications(cand.qualifications)
      .map((qua) => qua.filter((value) => value.qualified))

      console.log(candidateQualification)
      const candidateOk = candidateQualification.reduce((acc, value) => acc + value.length, 0)
      return {
        name: cand.name,
        matched: candidateOk
      }
    })

    console.log("table data")
    console.log(newTableData)

    setTableData(newTableData)
    setResults(response)
    setViewing(response[0])
  }

  useEffect(() => {
    getJobData()
    getCandidateData()
  }, [])

  return (
    <div className='flex flex-col bg-gradient-to-t from-[#F4D2FF] to-[#E8E8E8] w-screen h-screen overflow-hidden'>
      <PageHeader />
      <div id="body"
      className='flex mx-32 py-12 gap-14
      flex-1 overflow-hidden'>
        <div className="flex flex-col gap-12 flex-1">
          <h1
          className="bg-gradient-to-r from-[#57116F] to-[#A720D4] text-transparent bg-clip-text font-[700] text-6xl pb-10">
            {title}
            </h1>
          <CandidateDetails tableData={tableData} maxValue={maxQua} onRowClick={onTableRowClick}/>
        </div>
        <ResumeDetails viewing={viewing} />
      </div>
    </div>
  )
}

export default JobResume
