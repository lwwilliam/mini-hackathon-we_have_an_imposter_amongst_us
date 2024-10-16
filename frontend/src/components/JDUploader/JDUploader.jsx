import { useEffect, useRef, useState } from "react";
import PDFUploader from "../pdfUpload/uploadPdf";
import Modal from "../Modal";

const TagDivs = ({tagData, clicked, onClick}) => {
	const clickHandler = () => {
		onClick()
	}

	return (
	<div 
		className={`px-3 border-1 border-black border-solid rounded-xl ${clicked ? 'bg-green-500' : 'bg-white'}`}
		onClick={clickHandler}
	>
		{tagData.tag_name}
	</div>
	)
}

const JDUploader = ({ open, onClose }) => {
	const modalRef = useRef(null);
  const [procesState, setProcessing] = useState(false)
	const [allTags, setAllTags] = useState([])
	const [tagArray, setTag] = useState([])

	const getAllTags = async () => {
		const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllTags`)
		const response = await request.json()
		if (!request.ok) {
			console.error("Shit, panic")
			return 
		}
		setAllTags(response)
	}

	useEffect(() => {
		getAllTags()
	}, [])

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

	const modifyTagArray = (tagData) => {
		console.log(tagArray)
		console.log(tagData)
		const newTagArray = tagArray.slice()
		const index = newTagArray.indexOf(tagData)
		console.log(index)
		if (index < 0)
			newTagArray.push(tagData)
		else
			newTagArray.splice(index, 1);
		setTag(newTagArray)
	}

	const uploadPDF = async (files) => {
		console.log(tagArray)
		const file = files[0]

		console.log(file)

		const url = `${process.env.REACT_APP_BACKEND_URL}/api/parseJD`
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

		setTag([])
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
      flex flex-col justify-center items-center overflow-auto px-48'>
        { procesState ? <span>Uploading ...</span> : 
				<PDFUploader 
					onClose={onClose}
					setProcessing={setProcessing}
					onUpload={uploadPDF}
				>
					<div className="flex flex-col gap-2">
						<div>Select Tags: </div>
						<div className="flex flex-wrap gap-2">
							{ allTags.map( (val) =>
								<TagDivs 
								tagData={val}
								clicked={tagArray.indexOf(val) >= 0}
								onClick={() => modifyTagArray(val)}
							/>) }
						</div> 
					</div>
				</PDFUploader>
				}
			</div>
		</Modal>
	)
}

export default JDUploader