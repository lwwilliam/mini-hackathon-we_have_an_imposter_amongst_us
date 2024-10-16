import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/pageHeader/Header.jsx';
import DisplayPDFModal from './resumeModal.jsx';
import ResumeUploader from '../../components/ResumeUploader/ResumeUploader.jsx';

const SearchBar = () => {
  return (
    <div className='flex flex-1 gap-5'>
      <input
      type='text' placeholder='Search By Candidate Name'
      className='flex-1 rounded-full pl-5 border-2 border-solid border-[#57116F] w-[25rem]'
      />
      <button
      className='bg-[#57116F] text-white px-5 rounded-full transition duration-150 ease-in-out
            hover:-translate-y-2 cursor-pointer'
      >Filter</button>
    </div>
  )
}

const UploadButton = () => {
  const [modelState, setModalState] = useState(false)

  const openUploadPDFModal = () => {
    setModalState(true)
  }

  const onClose = () => {

    setModalState(false)
    window.location.reload()

  }

  return (
    <>
    <button
      className='bg-[#57116F] text-white px-5 rounded-full transition duration-150 ease-in-out
            hover:-translate-y-2 cursor-pointer'
      onClick={openUploadPDFModal}
    >Upload</button>
    <ResumeUploader open={modelState} onClose={onClose} />
    {/* <UploadPDFModal open={modelState} onClose={() => setModalState(false)} apiURL={`${process.env.REACT_APP_BACKEND_URL}/api/ai`}/> */}
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

  const TableRowData = ({name, positions, id}) => {
    const [modelState, setModalState] = useState(false)
    const openResumeModal = () => {
      setModalState(true)
    }
    return (
      <div className='grid grid-cols-3 py-2 border-b-2 border-solid border-[#E6E6E6] cursor-pointer' onClick={openResumeModal}>
        <DisplayPDFModal open={modelState} onClose={() => setModalState(false)} id={id}/>
        <p>{name}</p>
        <p className='col-span-2 text-ellipsis overflow-hidden whitespace-nowrap'>{positions}</p>
      </div>
    )
  }

  // woahh mock data
  // const data = Array(6).fill({
  //   name: 'Lee William',
  //   positions: 'Product Engineer [PHP], Senior Software Developer (JAVA), Janitor, Toilet Washer'
  // })


  const [allResume, setAllResume] = useState([]);
  const [tags, setTags] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllResumes`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      setAllResume(data);
      // console.log(data)
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  function getTagsName(arr_id) {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getTags?tags=${arr_id}`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      setTags(prevTags => ({
        ...prevTags,
        [arr_id]: data.join(", ")
      }));
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(() => {
    allResume.forEach(val => {
      if (val.tag_ids) {
        getTagsName(val.tag_ids.join(", "));
      }
    });
  }, [allResume]);

  return (
    <div className='flex flex-col gap-2 font-medium overflow-hidden'>
      <div className='flex flex-col overflow-hidden flex-1 rounded-xl'>
        <div className='grid grid-cols-3 text-center bg-[#57116F] text-white py-1'>
          <div>Candidate Name</div>
          <div className='col-span-2'>Matched Job Description</div>
        </div>

        <div className='flex flex-col overflow-auto text-center flex-1 bg-white border-collapse'>
          {allResume.map((val => val.name && <TableRowData name={val.name} positions={val.tag_ids ? tags[val.tag_ids.join(", ")] || "" : ""} id={val._id} />))}
        </div>
      </div>
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
        <div className='flex space-x-0 justify-between'>
          <h1 className="bg-gradient-to-r from-[#57116F] to-[#A720D4] text-transparent bg-clip-text font-[700] text-6xl">Resumes</h1>
          <div className='flex gap-5 my-2'>
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
