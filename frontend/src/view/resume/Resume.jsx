import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadPDFModal from '../../components/pdfUpload/uploadPdf';
import PageHeader from '../pageHeader/Header';

const SearchBar = () => {
  return (
    <div className='flex flex-1 gap-5'>
      <input
      type='text' placeholder='Search By Candidate Name'
      className='flex-1 rounded-3xl pl-5 border-2 border-solid border-[#57116F]'
      />
      <button
      className='bg-[#57116F] text-white px-5 rounded-3xl'
      >Filter</button>
    </div>
  )
}

const UploadButton = () => {
  const [modelState, setModalState] = useState(false)

  const openUploadPDFModal = () => {
    setModalState(true)
  }

  return (
    <>
    <button
      className='bg-[#57116F] text-white px-5 rounded-3xl'
      onClick={openUploadPDFModal}
    >Upload</button>
    <UploadPDFModal open={modelState} onClose={() => setModalState(false)} apiURL={``}/>
    </>
  )
}

const ResumeTables = () => {
  const TableEmptyRow = () => {
    return (
      <div className='grid grid-cols-3 py-2 border-b-2 border-solid border-[#E6E6E6] text-ellipsis overflow-hidden whitespace-nowrap'>
      </div>
    )
  }

  const TableRowData = ({name, positions}) => {
    return (
      <div className='grid grid-cols-3 py-2 border-b-2 border-solid border-[#E6E6E6]'>
        <p>{name}</p>
        <p className='col-span-2 text-ellipsis overflow-hidden whitespace-nowrap'>{positions}</p>
      </div>
    )
  }

  // woahh mock data
  const data = Array(6).fill({
    name: 'Lee William',
    positions: 'Product Engineer [PHP], Senior Software Developer (JAVA), Janitor, Toilet Washer'
  })

  return (
    <div className='flex flex-col gap-2 font-medium'>
      <div className='flex flex-col overflow-hidden flex-1 rounded-xl'>
        <div className='grid grid-cols-3 text-center bg-[#57116F] text-white py-1'>
          <div>Candidate Name</div>
          <div className='col-span-2'>Matched Job Description</div>
        </div>

        <div className='grid grid-rows-14 overflow-auto text-center flex-1 bg-white border-collapse'>
          { data.map((val) => <TableRowData name={val.name} positions={val.positions} />) }
          { Array(7).fill(<TableEmptyRow />) }
        </div>
      </div>
      <p className='self-stretch text-right'>Page 1 of 13</p>
    </div>

  )
}

// <div className='flex flex-col overflow-auto text-center flex-1 bg-white border-collapse'>
//   { /** max 14 entries i think? */ }
//   { Array(7).fill(<TableRowData />) }
//   { Array(7).fill(<TableEmptyRow />) }
// </div>

const Resume = () => {
  return (
    <div className='flex flex-col bg-gradient-to-t from-[#F4D2FF] to-[#E8E8E8] w-screen h-screen overflow-hidden'>
      <PageHeader />
      <div id="body" className='flex flex-col mx-32 py-12 flex-1 gap-12 overflow-hidden'>
        <div className='flex space-x-0 gap-96'>
          <h1 className="bg-gradient-to-r from-[#57116F] to-[#A720D4] text-transparent bg-clip-text font-[700] text-6xl">Resumes</h1>
          <div className='flex flex-1 gap-5 my-2'>
            <SearchBar />
            <UploadButton />
          </div>
        </div>
        <ResumeTables />
      </div>
    </div>
  );
}

export default Resume;

// table sucks dick

// const ResumeTables = () => {
//   const TableRowData = () => {
//     return (
//       <tr>
//         <td>Lee William</td>
//         <td>Product Engineer [PHP], Senior Software Developer (JAVA), Janitor</td>
//       </tr>
//     )
//   }

//   return (
//     <div className='flex overflow-auto flex-1'>
//       <table className='flex-1 text-center'>
//         <thead className='bg-[#57116F] text-white font-normal'>
//           <tr>
//             <th>Candidate Name</th>
//             <th>Matched Job Description</th>
//           </tr>
//         </thead>
//         { Array(10).fill(<TableRowData />) }
//       </table>
//     </div>
//   )
// }
