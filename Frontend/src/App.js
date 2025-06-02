import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './contexts/AuthContext';
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Tasks';
import Admin from './pages/Admin';
import Client from './pages/Client';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Projects />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/client" element={<Client />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
