
import Navbar from '../component/Navbar'
import studentImage from '../assets/student.jpeg'
import { TbAbc } from "react-icons/tb";
import { AiOutlineSound } from "react-icons/ai";
import { IoColorPaletteOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
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
   <Link to='/login'><button className='bg-teal-600 text-amber-50 p-2 rounded-xl'>Start Learning</button></Link>
    <button className='bg-gray-200 text-black-50 p-2 rounded-xl'>Explore Courses</button>
    </div>
    </div>
    {/* tailored sucess for dyslexic students. */}
    <div className='relative bottom-60 left-135 '>
    <p className='font-black text-4xl'>Tailored for Your Sucess</p>
    <h1 className='relative right-16 mt-2 text-gray-400'>Our platform is built from the ground up with features designed to support and <br></br>empower dyslexic learners</h1>
   <div className='flex gap-15 mt-10 relative right-76 '> 
   <div className='bg-white shadow-amber-50 p-4 rounded-2xl'>
  <TbAbc className={'relative left-25'}
  size={50}/>
     <h1 className='flex justify-center font-bold text-xl'>Readable Text</h1>
     <p className='text-gray-400'> Enjoy content is highly readable,<br></br>dyslexia-friendly fonts with ajustable 
     <br></br>spacing.</p>
   </div>
    <div className='bg-white shadow-amber-50 p-4 rounded-2xl'>
<AiOutlineSound className={'relative left-25'}
  size={50}/>
       <h1 className='flex justify-center font-bold text-xl'>Audio Lessons</h1>
       <p className='text-gray-400'>Listen to lessons and text read aloud<br></br> to aid comprehension and reduce <br></br>reading strain</p>
       </div>
  <div className='bg-white shadow-amber-50 p-4 rounded-2xl'>
<IoColorPaletteOutline className={'relative left-25'}
  size={50}/>
    <h1 className='flex justify-center font-bold text-xl'>Custom Themes</h1>
    <p className='text-gray-400'>Personalize your learning<br></br>environment with fonts and <br></br>background colors that work for you</p>
    </div>
    </div>
    </div>
    
    </div>
  )
}

export default Homepage
