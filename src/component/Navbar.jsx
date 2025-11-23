import { Link } from "react-router-dom"

function Navbar() {
  return (
      <div className=" m-7 flex justify-center gap-59">
    <div className="font-bold">DyslexiaLearn</div>
    {/* middle part */}
   
    <div className="flex gap-12" >
    <Link to='/'>  <button>Home</button></Link>
      <p>Courses</p>
      <Link to='/tools'><p>Tools</p></Link> 
    </div>
    {/* end part */}
    <div className="flex gap-3">
      <button className="bg-green-700 w-20 text-amber-50 p-2 rounded-xl ">Login</button>
      <button className="bg-gray-200 p-2 rounded-xl">A-</button>
      <button className="bg-gray-200 p-2 rounded-xl">A+</button>
      <button className="bg-gray-200  p-2 rounded-xl" >🌙</button>
    </div>
    </div>
  )
}

export default Navbar