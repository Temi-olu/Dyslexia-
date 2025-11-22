
import Navbar from '../component/Navbar'
import studentImage from '../assets/student.jpeg'
function Homepage() {
  return (

    <div>
 <Navbar />
<img src={studentImage} alt="Student Learning" 
className='w-lg bg-yellow-50 p-4 rounded-2xl ml-180 mt-20'
/>
<div className='relative bottom-90 left-60'>
   <h1 className='font-black text-6xl leading-15 '>Learning Made <br></br> Easier for <br></br>Dyslexic <br></br>students</h1>
    <p className='text-gray-400 mt-2 '>Personalized lessons,audio support,
      and readable <br></br>text designed for YOU. </p>
      <div className=' flex gap-5 mt-4'>
    <button className='bg-green-700 text-amber-50 p-2 rounded-xl'>Start Learning</button>
    <button className='bg-gray-200 text-black-50 p-2 rounded-xl'>Explore Courses</button>
    </div>
    </div>
    </div>
  )
}

export default Homepage
