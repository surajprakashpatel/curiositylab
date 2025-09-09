import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './contexts/AuthContext';
import { GithubProvider } from './contexts/GithubContext';
import Main from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Tasks';
import Admin from './pages/Admin';
import Client from './pages/Client';
import PrivacyPolicy from './pages/KartavyaPrivacy';

function App() {
  return (
    <AuthProvider>
      <GithubProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/privacy-policy-kartavya" element={<PrivacyPolicy/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Projects />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/client" element={<Client />} />
          </Routes>
        </Router>
      </GithubProvider>
    </AuthProvider>
  )
}

export default App;
