import React from 'react';
import { useNavigate } from 'react-router-dom';

const Test1 = () => {
  const nav = useNavigate();

  return (
    <div>
      <h1 className="text-2xl">Test1</h1>
      <p>Test1 page content</p>
      <div
        onClick={() => nav('/test2')}
        className="cursor-pointer text-blue-500"
      >
        NAV to Test 2
      </div>
    </div>
  );
};

export default Test1;
