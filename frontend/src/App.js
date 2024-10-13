import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Test1 from './view/test1/test1';
import Test2 from './view/test2/test2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Test1/>} />
        <Route path='/test2' element={<Test2/>} />
      </Routes>
    </Router>
  );
}

export default App;
