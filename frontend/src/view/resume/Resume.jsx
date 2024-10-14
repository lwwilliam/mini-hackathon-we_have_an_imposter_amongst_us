import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  return (
    <button
      className='bg-[#57116F] text-white px-5 rounded-3xl'
    >Upload</button>
  )
}

const ResumeTables = () => {
    const TableRowData = () => {
      return (
        <div className='grid grid-cols-3 py-1 border-b-2 border-solid border-[#E6E6E6]'>
          <p>Lee William</p>
          <p className='col-span-2'>Product Engineer [PHP], Senior Software Developer (JAVA), Janitor</p>
        </div>
      )
    }
  
    return (
      <div className='flex flex-col overflow-hidden flex-1 rounded-xl font-medium'>
        <div className='grid grid-cols-3 text-center bg-[#57116F] text-white py-1'>
          <div>Candidate Name</div>
          <div className='col-span-2'>Matched Job Description</div>
        </div>
        <div className='flex flex-col overflow-auto text-center flex-1 bg-white border-collapse'>
          { Array(60).fill(<TableRowData />) }
        </div>
      </div>
    )
  }

const Resume = () => {
  const nav = useNavigate()

  return (
    <div className='flex bg-gradient-to-t from-[#F4D2FF] to-[#E8E8E8] w-screen h-screen overflow-hidden'>
      <div className='flex flex-col px-24 py-32 flex-1 gap-12'>
        <div className='flex space-x-0 gap-96'>
          <h1 class="bg-gradient-to-r from-[#57116F] to-[#A720D4] inline-block text-transparent bg-clip-text font-bold text-6xl">Resumes</h1>
          <div class='flex flex-1 gap-5 my-2'>
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