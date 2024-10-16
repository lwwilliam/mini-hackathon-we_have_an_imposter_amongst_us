import React from "react";

import ResumeDetails from "./compenents/resumeDetails";

import PageHeader from "../../components/pageHeader/Header.jsx";

const CandidateDetails = () => {
  const TableEmptyRow = () => {
    return (
      <div className='grid grid-cols-3 py-2 border-b-2 border-solid border-[#E6E6E6] text-ellipsis overflow-hidden whitespace-nowrap'>
      </div>
    )
  }

  const TableRowData = ({name, matched}) => {
    return (
      <div className='grid grid-cols-3 py-2 border-b-2 border-solid border-[#E6E6E6]'>
        <p>{name}</p>
        <p className='col-span-2 text-ellipsis overflow-hidden whitespace-nowrap'>{matched}</p>
      </div>
    )
  }

  // woahh mock data
  const data = Array(5).fill({
    name: 'Lee William',
    matched: '13/13'
  })

  return (
    <div className='flex flex-col gap-2 font-medium'>
      <div className='flex flex-col overflow-hidden flex-1 rounded-xl'>
        <div className='grid grid-cols-3 text-center bg-[#57116F] text-white py-1'>
          <div>Candidate Name</div>
          <div className='col-span-2'>Qualication Matched</div>
        </div>

        { /** Max rows is 5 */ }
        <div className='grid grid-rows-5 overflow-auto text-center flex-1 bg-white border-collapse'>
          { data.map((val, index) => <TableRowData key={index} name={val.name} matched={val.matched} />) }
        </div>
      </div>
      <p className='self-stretch text-right'>Page 1 of 2</p>
    </div>

  )
}

const JobResume = () => {
  return (
    <div className='flex flex-col bg-gradient-to-t from-[#F4D2FF] to-[#E8E8E8] w-screen h-screen overflow-hidden'>
      <PageHeader />
      <div id="body"
      className='flex mx-32 py-12 gap-14
      flex-1 overflow-hidden'>
        <div className="flex flex-col gap-12 flex-1">
          <h1
          className="bg-gradient-to-r from-[#57116F] to-[#A720D4] text-transparent bg-clip-text font-[700] text-6xl">Resumes Matched for Product Engineer [PHP]</h1>
          <CandidateDetails />
        </div>
        <ResumeDetails />
      </div>
    </div>
  )
}

export default JobResume
