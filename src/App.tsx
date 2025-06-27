
import './App.css';
import Home from './Component/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Component/login';
import GetAllUser from './Component/getUser';
import AllUserDetails from './Component/getAllUserDetails';
import Navbar from './Component/Navbar';
import { SplitNavItems } from './Component/UserProfile';
import { useState } from 'react';
import Footer from './Component/Footer';
function App() {

  const [apiEndpoint, setApiEndpoint] = useState('')
  const [searchValue, setSearchValue] = useState('')
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar setApiEndpoint = {setApiEndpoint}  setSearchValue ={setSearchValue}  />
        <header className="App-header">
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/register' element={<Home />}></Route>
            <Route path='/login' element={<Login />} />
            <Route path='/user_details' element={<GetAllUser />}></Route>
            <Route path='/all_user_details' element={<AllUserDetails apiEndpoint = {apiEndpoint}  searchValue={searchValue} />}></Route>
            <Route path='/profile' element={<SplitNavItems />}></Route>
          </Routes>
        </header>
        {/* <Footer/> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
