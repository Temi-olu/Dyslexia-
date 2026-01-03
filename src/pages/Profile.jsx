import grace5 from '../assets/grace5.jpg'
import { Link } from 'react-router-dom';
function Profile () {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-teal-700">DyslexiaLearn</span>
          </div>
    <nav className="flex items-center gap-8 text-gray-600 font-medium">
   <Link to='/'><a href="#" className="hover:text-teal-700">Home</a>    </Link>
   <Link><a href="#" className="hover:text-teal-700">Courses</a></Link>  
 <Link><a href="#" className="text-teal-700 font-semibold">Profile</a></Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              🔔
            </div>
            <div className="w-10 h-10 bg-orange-200 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-gray-500 mb-6">
          View and manage your account details and progress.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Profile header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={grace5} className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center"
                 />

              <div>
                <h2 className="text-xl font-bold">Temi Olu</h2>
                <p className="text-gray-500 text-sm">temi.olu@example.com</p>
              </div>
            </div>

            <button className="bg-orange-300 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition">
              Edit Profile
            </button>
          </div>

          <hr className="my-6" />

          {/* Progress */}
          <h3 className="text-lg font-semibold text-teal-700 mb-4">
            My Progress
          </h3>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl text-center border">
              <p className="text-gray-500 text-sm">Courses Completed</p>
              <p className="text-2xl font-bold mt-1">12</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-center border">
              <p className="text-gray-500 text-sm">Words Mastered</p>
              <p className="text-2xl font-bold mt-1">247</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-center border">
              <p className="text-gray-500 text-sm">Learning Time</p>
              <p className="text-2xl font-bold mt-1">36 hours</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-center border">
              <p className="text-gray-500 text-sm">Current Streak</p>
              <p className="text-2xl font-bold mt-1">14 days</p>
            </div>
          </div>

          <hr className="my-6" />

          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500">
            ↩ Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

