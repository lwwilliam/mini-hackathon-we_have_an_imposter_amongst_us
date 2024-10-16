import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../components/Modal';

const DisplayPDFModal = ({ open, onClose, id }) => {
  const modalRef = useRef(null);
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

  const [allDisplay, setDisplay] = useState([]);

  function apiCall() {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getPDF?id=` + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setDisplay(data);
      console.log(data)
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  return (
    <Modal open={open}>
      <div ref={modalRef}
        className='bg-white rounded-lg h-[20rem] w-[35rem]
        flex flex-col justify-center items-center'
      >
      </div>
    </Modal>
  )
}

export default DisplayPDFModal
