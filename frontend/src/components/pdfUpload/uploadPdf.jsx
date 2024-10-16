import React, { useEffect, useRef, useState } from 'react';



const preventDefaults = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

const PDFUploader = ({onClose, setProcessing, onUpload, children}) => {
  const [ drag, setDrag ] = useState(false)
  const [ files, setFiles ] = useState([])
  const fileinputRef = useRef(null);

  const uploadPDFFile = async () => {
    setProcessing(true)
    await onUpload(files)
    setProcessing(false)
    onClose()
  }

  const handleDropFile = (e) => {
    e.preventDefault()

    const files = e.dataTransfer.files
    fileinputRef.current.files = files
    setFiles(files)
  }

  return (
  <div className='flex flex-col gap-5'>
    <input ref={fileinputRef} type="file" name="upload" accept="application/pdf" id="upload-pdf" className='opacity-0'
    onChange={e => setFiles(e.target.files)}
    />
    <label htmlFor="upload-pdf">
      <div
      className={`bg-[#E7E7E7] h-[13rem] w-[25rem]
      border-dashed border-[#57116F] border-2 rounded-2xl
      items-center justify-center gap-5 flex flex-col flex-1 text-[#57116F]
      hover:scale-105
      hover:shadow-xl
      ${drag ? 'scale-105 shadow-xl' : ""}
      transition duration-150 ease-in-out`}

      // element dropped into another element
      onDrop={handleDropFile}

      // element continuously dragged over another element
      onDragOver={preventDefaults}
      // element dragged into another element
      onDragEnter={(e) => {
        preventDefaults(e)
        setDrag(true)
      }}
      // element dragged outside another element
      onDragLeave={(e) => {
        preventDefaults(e)
        setDrag(false)
      }}
      >
        <img src='/upload.png'></img>
        <span className='text-center'>
          { files.length ? `${files.length} files added` : 'Drop files here to upload'}
        </span>
      </div>
    </label>
    {children}
    <button
    className='bg-white flex-1 rounded-xl border-solid border-black border-2 py-1'
    onClick={uploadPDFFile}
    >Submit</button>
  </div>)
}

export default PDFUploader
