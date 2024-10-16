import { useEffect, useRef, useState } from "react";
import PDFUploader from "../pdfUpload/uploadPdf";
import Modal from "../Modal";

const ResumeUploader = ({ open, onClose }) => {
	const modalRef = useRef(null);
  const [procesState, setProcessing] = useState(false)

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

	const uploadPDF = async (files) => {
		  const file = files[0]
	
		  console.log(file)
	
		  const url = `${process.env.REACT_APP_BACKEND_URL}/api/ai`
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
	}

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
        { procesState ? <span>Uploading ...</span> : 
				<PDFUploader 
					onClose={onClose}
					setProcessing={setProcessing}
					onUpload={uploadPDF}
				/> }
			</div>
		</Modal>
	)
}

export default ResumeUploader