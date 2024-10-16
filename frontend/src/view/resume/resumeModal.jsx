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
        className='bg-white rounded-lg h-[50rem] w-[40rem]
        flex flex-col justify-center items-center'
      >
        <embed ref={embedRef} />
      </div>
    </Modal>
  )
}

export default DisplayPDFModal
