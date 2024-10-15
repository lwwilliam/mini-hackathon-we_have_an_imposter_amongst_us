import React, { useEffect, useRef, useState } from 'react';
import Modal from "../Modal";
// import uploadImage from "@/assets/upload.svg";

const preventDefaults = (e: React.DragEvent | React.ChangeEvent | React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

interface PDFUploaderProps {
  onClose: () => void;
  setProcessing: (processing: boolean) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onClose, setProcessing }) => {
  const [drag, setDrag] = useState(false);
  const fileinputRef = useRef<HTMLInputElement>(null);

  const uploadPDFFile = async () => {
    if (!fileinputRef.current || !fileinputRef.current.files) return;
    const file = fileinputRef.current.files[0];

    console.log(file);

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/parseJD`;
    const formData = new FormData();
    formData.append('File', file);

    try {
      setProcessing(true);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const json = await response.json();
      console.log(json.msg);
    } catch {
      alert("Well that failed");
    }
    setProcessing(false);
    onClose();
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (fileinputRef.current) {
      fileinputRef.current.files = files;
      uploadPDFFile();
    }
  };

  return (
    <>
      <input
        ref={fileinputRef}
        type="file"
        name="upload"
        accept="application/pdf"
        id="upload-pdf"
        className="opacity-0"
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
          onDrop={handleDropFile}
          onDragOver={preventDefaults}
          onDragEnter={(e) => {
            preventDefaults(e);
            setDrag(true);
          }}
          onDragLeave={(e) => {
            preventDefaults(e);
            setDrag(false);
          }}
        >
          {/* <img src={uploadImage} alt="Upload" /> */}
          <span className="text-center">Drop files here to upload</span>
        </div>
      </label>
    </>
  );
};

interface UploadPDFModalProps {
  open: boolean;
  onClose: () => void;
}

const UploadPDFModal: React.FC<UploadPDFModalProps> = ({ open, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [procesState, setProcessing] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <Modal open={open}>
      <div
        ref={modalRef}
        className="bg-white rounded-lg h-[35rem] w-[30rem] md:h-[50rem] md:w-[50rem] 
        flex flex-col justify-center items-center overflow-auto"
      >
        {procesState ? (
          <span>Uploading ...</span>
        ) : (
          <PDFUploader onClose={onClose} setProcessing={setProcessing} />
        )}
      </div>
    </Modal>
  );
};

export default UploadPDFModal;