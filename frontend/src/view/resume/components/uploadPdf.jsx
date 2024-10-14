import React, { useEffect, useRef, useState } from 'react';
import Modal from "../../../components/Modal.tsx";
import uploadImage from "../assets/uploadImage.png"

const preventDefaults = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

const PDFUploader = ({onClose, setProcessing}) => {
  const [ drag, setDrag ] = useState(false)
  const fileinputRef = useRef(null);

  const uploadPDFFile = async () => {
    const file = fileinputRef.current.files[0] // Temp

    console.log(file)

    const url = 'http://localhost:5000/api/ai'
    const formData = new FormData()
    formData.append('File', file)

    try {
      setProcessing(true)
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })
      const json = await response.json()
      // uhh heres the message, idk what u wanna do w/ this
      console.log(json.msg)
    } catch {
      alert("Well that failed")
    }
    setProcessing(false)
    onClose()
  }

  const handleDropFile = (e) => {
    e.preventDefault()

    const files = e.dataTransfer.files
    fileinputRef.current.files = files
    uploadPDFFile()
  }

  return (
  <>
    <input ref={fileinputRef} type="file" name="upload" accept="application/pdf" id="upload-pdf" className='opacity-0'
    onChange={uploadPDFFile}
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
        <img src={uploadImage}></img>
        <span className='text-center'>
          Drop files here to upload
        </span>
      </div>
    </label>
  </>)
}

const UploadPDFModal = ({open, onClose}) => {
	const modalRef = useRef(null);
  const [procesState, setProcessing] = useState(false)

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
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
			<div ref={modalRef} 
      className='bg-white rounded-lg h-[35rem] w-[30rem] md:h-[50rem] md:w-[50rem] 
      flex flex-col justify-center items-center overflow-auto'>
        { procesState ? <span>Uploading ...</span> : <PDFUploader onClose={onClose} setProcessing={setProcessing} /> }
			</div>
		</Modal>
	)
}

export default UploadPDFModal