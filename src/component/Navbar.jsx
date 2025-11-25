import { Link } from "react-router-dom"

function Navbar() {
  return (
      <div className=" m-7 flex justify-center gap-59">
    <div className="font-bold">DyslexiaLearn</div>
    {/* middle part */}
   
    <div className="flex gap-12" >
    <Link to='/'>  <button className="cursor-pointer">Home</button></Link>
    <Link to='/courses'> <button  className="cursor-pointer">Courses</button></Link> 
      <Link to='/tools'><button className="cursor-pointer">Tools</button></Link> 
    </div>
    {/* end part */}
    <div className="flex gap-3">
     <Link to='/login'><button className="bg-green-700 w-20 text-amber-50 p-2 rounded-xl ">Login</button></Link> 
      <button className="bg-gray-200 p-2 rounded-xl">A-</button>
      <button className="bg-gray-200 p-2 rounded-xl">A+</button>
      <button className="bg-gray-200  p-2 rounded-xl" >🌙</button>
    </div>
    </div>
  )
}

export default Navbar