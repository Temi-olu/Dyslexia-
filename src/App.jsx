
import Homepage from './pages/Homepage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <div className='min-h-screen flex flex-col overflow-x-hidden'>
     <BrowserRouter>
     <Routes>
      <Route path ='/' element={<Homepage />} >

      </Route>
     </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
