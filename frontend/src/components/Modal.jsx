import React from 'react';

function Modal({ open, children }) {
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center duration-300 ease-in-out transition-colors ${open ? 'visible bg-black/50' : 'invisible'}`}
    >
      <div
        className={`duration-300 ease-in-out transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
