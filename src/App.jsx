
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Registerpage from './pages/Registerpage'
import Toolspage from './pages/Toolspage'
import Dashboard from './pages/Dashboard'
import CoursesPage from './pages/CoursesPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile'
function App() {
  return (
    <div className='min-h-screen flex flex-col overflow-x-hidden bg-gray-50'>
     <BrowserRouter>
     <Routes>
      <Route path ='/' element={<Homepage />} ></Route>
      <Route path ='/login' element={<Loginpage />} ></Route>
      <Route path ='/register' element={<Registerpage />} ></Route>
      <Route path ='/tools' element={<Toolspage />} ></Route>
      <Route path ='/dashboard' element={<Dashboard />} ></Route>
      <Route path='/profile' element={<Profile/>} ></Route>
      <Route path='/courses' element={<CoursesPage/>} ></Route>
     </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
