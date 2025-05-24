import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Main from './pages/Main'


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      {/* <Route path="/tasks" element={<Tasks/>}/> */}
    </Routes>

    </BrowserRouter>
  )
}

export default App;
