import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Test1 from './view/test1/test1';
import Test2 from './view/test2/test2';
import JobDescriptions from './view/jobDescriptions/jobDescriptions.tsx';

import JobResume from './view/jobResume/JobResume.jsx'
import Resume from './view/resume/Resume';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path='/' element={<Test1/>} />
        <Route path='/test2' element={<Test2/>} /> */}
        <Route path='/' element={<Resume />} />
        <Route path='/job' element={<JobDescriptions/>} />
        <Route path='/job/analysis' element={< JobResume />} />
      </Routes>
    </Router>
  );
}

export default App;
