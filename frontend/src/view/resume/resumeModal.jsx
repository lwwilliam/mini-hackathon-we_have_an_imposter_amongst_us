import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../components/Modal';

const DisplayPDFModal = ({ open, onClose, id }) => {
  const modalRef = useRef(null);
  const embedRef = useRef(null);

  const handleClickOutside = (event) => {
  if (modalRef.current && !modalRef.current.contains(event.target)) {
    onClose();
  }
  };

  useEffect(() => {
    open ? document.addEventListener('mousedown', handleClickOutside)
      : document.removeEventListener('mousedown', handleClickOutside)
    if (open)
      apiCall()
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const [pdf, setPDF] = useState(new Blob());

  function apiCall() {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getPDF?id=` + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.blob())
    .then(blob => {

      setPDF(blob)

    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(() => {

    if (embedRef.current) {

      const url = URL.createObjectURL(pdf)
      embedRef.current.src = url
    }


  }, [pdf])


  return (
    <Modal open={open}>
      <div ref={modalRef}
        className='bg-[#ffffff] rounded-lg p-2 h-[58rem] w-[48rem]
        flex flex-col justify-center items-center'
      >
        <embed ref={embedRef} width="100%" height="100%"/>
      </div>
    </Modal>
  )
}

export default DisplayPDFModal
