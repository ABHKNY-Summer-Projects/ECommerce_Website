import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  )
}

export default App
