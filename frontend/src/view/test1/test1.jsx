import React from 'react';
import { useNavigate } from 'react-router-dom';

const Test1 = () => {
  const nav = useNavigate();

  return (
    <div>
      <h1 className="text-2xl">Test1</h1>
      <p>Test1 page content</p>
      <div onClick={() => nav("/test2")} className='cursor-pointer text-blue-500'>NAV to Test 2</div>
      <div className='flex bg-black h-auto w-96 gap-x-1 gap-y-1 flex-wrap'>
        <div className='bg-green-400 h-16 w-16'></div>
        <div className='bg-green-400 h-16 w-72'></div>
        <div className='bg-green-400 h-16 w-12'></div>
        <div className='bg-green-400 h-16 w-20'></div>
        <div className='bg-green-400 h-16 w-10'></div>
        <div className='bg-green-400 h-16 w-20'></div>
        <div className='bg-green-400 h-16 w-6'></div>
        <div className='bg-green-400 h-16 w-48'></div>
        <div className='bg-green-400 h-16 w-44'></div>
        <div className='bg-green-400 h-16 w-3'></div>
        <div className='bg-green-400 h-16 w-32'></div>
        <div className='bg-green-400 h-16 w-28'></div>
      </div>
    </div>
  );
};

export default Test1;
