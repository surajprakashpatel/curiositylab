import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Main from './pages/Main'
import Tasks from './pages/Tasks'
import Admin from './pages/Admin'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Tasks/>}/>
          <Route path='/admin' element={<Admin/>}/>
          {/* <Route path="/tasks" element={<Tasks/>}/> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
