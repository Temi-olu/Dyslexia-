import Navbar from '../component/Navbar';
import studentImage from '../assets/student.jpeg';
import OIP from '../assets/OIP.jpg';
import { TbAbc } from "react-icons/tb";
import { AiOutlineSound } from "react-icons/ai";
import { IoColorPaletteOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Textspeech from '../assets/Textspeech.jpg';
import Adjust from '../assets/Adjust.jpg';
import Footer from '../component/Footer';
import Testimonials from '../Data/Testimonials';

function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section - Responsive Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1">
            <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4">
              Learning Made <br />
              Easier for <br />
              Dyslexic <br />
              Students
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-6">
              Personalized lessons, audio support, and readable text designed for YOU.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to='/login'>
                <button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md">
                  Start Learning
                </button>
              </Link>
              <Link to='/courses'>
                <button className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all">
                  Explore Courses
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2">
            <img 
              src={studentImage} 
              alt="Student Learning" 
              className="w-full h-auto rounded-2xl shadow-lg bg-yellow-50 p-4"
            />
          </div>
        </div>
      </section>

      {/* Features Section - "Tailored for Your Success" */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-black text-3xl sm:text-4xl lg:text-5xl mb-4">
              Tailored for Your Success
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              Our platform is built from the ground up with features designed to support and empower dyslexic learners
            </p>
          </div>

          {/* Feature Cards - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Card 1: Readable Text */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <TbAbc size={50} className="text-teal-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Readable Text</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Enjoy content in highly readable, dyslexia-friendly fonts with adjustable spacing.
              </p>
            </div>

            {/* Card 2: Audio Lessons */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <AiOutlineSound size={50} className="text-teal-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Audio Lessons</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Listen to lessons and text read aloud to aid comprehension and reduce reading strain
              </p>
            </div>

            {/* Card 3: Custom Themes */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <div className="flex justify-center mb-4">
                <IoColorPaletteOutline size={50} className="text-teal-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Custom Themes</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Personalize your learning environment with fonts and background colors that work for you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Tools Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-800 text-center">
            Try Our Accessibility Tools
          </h2>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Tool 1: Adjust Font Size */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={Adjust} 
                alt="Adjust Font Size Tool"
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Adjust Font Size
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Increase readability for users with dyslexia.
                </p>
                <Link to="/tools">
                  <button className="w-full py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all">
                    Try It
                  </button>
                </Link>
              </div>
            </div>

            {/* Tool 2: Text-to-Speech */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={Textspeech} 
                alt="Text-to-Speech Tool"
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Text-to-Speech
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Listen to written content with clear narration
                </p>
                <Link to="/tools">
                  <button className="w-full py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all">
                    Try It
                  </button>
                </Link>
              </div>
            </div>

            {/* Tool 3: Change Background */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <img 
                src={OIP} 
                alt="Change Background Tool"
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Change Background
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose soothing colors to improve focus.
                </p>
                <Link to="/tools">
                  <button className="w-full py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all">
                    Try It
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-800 text-center">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {Testimonials.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6 sm:p-8 text-center"
              >
                <p className="text-gray-700 text-base sm:text-lg italic leading-relaxed mb-6">
                  "{item.text}"
                </p>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-teal-100 flex items-center justify-center font-semibold text-teal-700 text-lg">
                    {item.initial}
                  </div>

                  <h4 className="mt-4 text-gray-900 font-semibold text-base sm:text-lg">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Homepage;