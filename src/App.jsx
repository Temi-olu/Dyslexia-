
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Registerpage from './pages/Registerpage'
import Toolspage from './pages/Toolspage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <div className='min-h-screen flex flex-col overflow-x-hidden bg-gray-50'>
     <BrowserRouter>
     <Routes>
      <Route path ='/' element={<Homepage />} ></Route>
      <Route path ='/login' element={<Loginpage />} ></Route>
      <Route path ='/register' element={<Registerpage />} ></Route>
      <Route path ='/tools' element={<Toolspage />} ></Route>
     </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
