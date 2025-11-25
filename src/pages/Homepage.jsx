
import Navbar from '../component/Navbar'
import studentImage from '../assets/student.jpeg'
import OIP from '../assets/OIP.jpg'
import { TbAbc } from "react-icons/tb";
import { AiOutlineSound } from "react-icons/ai";
import { IoColorPaletteOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Textspeech from '../assets/Textspeech.jpg' 
import Adjust from '../assets/Adjust.jpg'
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
    <div className='relative bottom-60 left-120 '>
    <p className='font-black text-4xl'>Tailored for Your Sucess</p>
    <h1 className='relative right-16 mt-2 text-gray-400'>Our platform is built from the ground up with features designed to support and <br></br>empower dyslexic learners</h1>
   <div className='flex gap-15 mt-10 relative right-63 '> 
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
    {/* Accesibity tools */}
    {/* Responsive */}
<div className=" relative bottom-45  bg-gray-50 py-16 px-6 flex flex-col items-center">
<h2 className="text-3xl font-bold mb-10 text-gray-800 text-center ">Try Our Accessibility Tools</h2>


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3  max-w-6xl">
{/* Card 1 */}
<div className="bg-white rounded-2xl h-90 shadow-sm overflow-hidden">
 <img src={Adjust} className='w-80 h-50 rounded-t-xl '/>
<div className="p-5">
<h3 className="text-lg font-semibold text-gray-800 mb-2">Adjust Font Size</h3>
<p className="text-sm text-gray-600 mb-4">Increase readability for users with dyslexia.</p>
<button className="w-full mt-3 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition">Try It</button>
</div>
</div>

{/* Card 2 */}
<div className="bg-white rounded-2xl h-90 shadow-sm overflow-hidden">
 <img src={Textspeech} className='w-80 h-50 rounded-t-xl '/>
<div className="p-5">
<h3 className="text-lg font-semibold text-gray-800 mb-2">Text‑to‑Speech</h3>
<p className="text-sm text-gray-600 mb-4">Listen to written content with clear narration</p>
<button className="w-full mt-3 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition">Try It</button>
</div>
</div>


{/* Card 3 */}
<div className="bg-white rounded-2xl h-90 shadow-sm overflow-hidden">
 <img src={OIP} className='w-80 h-50 rounded-t-xl '/>
<div className="p-5">
<h3 className="text-lg font-semibold text-gray-800 mb-2">Change Background</h3>
<p className="text-sm text-gray-600 mb-4">Choose soothing colors to improve focus.</p>
<button className="w-full mt-3 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition">Try It</button>
</div>
</div>
</div>
</div>
{/* Navbar */}
<div className='relative bottom-93 bg-white opacity-90 h-25 p-3 w-270 ml-42 rounded-xl '><Navbar/></div>
 {/* Comment */}

  <div className='bg-green-100 h-70 mb-4 p-23'>
<div className='flex-col ml-120'>
    <h1 >"This platform helps me read without stress.The<br></br>audio lessons and font choices make huge<br></br>differences"</h1>
 <p>-Temi,Student</p>
  </div>
</div>
    
    </div>
  )
}

export default Homepage
