import React from "react";
import Sidebar from '../component/Sidebar'
import { Link } from "react-router-dom";
import grace5 from '../assets/grace5.jpg'
function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-sm py-4 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
          <h1 className="text-xl font-semibold">DyslexiaLearn</h1>
        </div>

        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li className="cursor-pointer hover:text-teal-600">Dashboard</li>
          <li className="cursor-pointer hover:text-teal-600">Courses</li>
    <Link to='/tools'><li className="cursor-pointer hover:text-teal-600">Tools</li></Link>      
        </ul>

        <div className="flex items-center gap-4">
          <img src={grace5} className="w-10 h-10 bg-gray-300 rounded-full" />
          <div className="w-10 h-10 border rounded-full flex items-center justify-center">
            ↻
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT LAYOUT (Sidebar + Page Content) */}
      <div className="flex flex-1">
        
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* MAIN DASHBOARD CONTENT AREA */}
        <div className="flex-1 p-10">
          <h1 className="text-4xl font-bold">Welcome, Temi!</h1>
          <p className="text-gray-600 mt-1">
            It's great to see you again. Let’s keep learning!
          </p>

          {/* PROGRESS CARD */}
          <div className="mt-8 bg-white border p-6 rounded-xl w-full max-w-3xl">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>Overall Progress</span>
              <span className="text-orange-500">35%</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div className="h-full bg-orange-400 w-[35%] rounded-full"></div>
            </div>

            <p className="text-gray-500 mt-2">Keep up the great work!</p>
          </div>

          <button className="mt-6 bg-teal-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            Continue Learning →
          </button>
        </div>

        {/* RIGHT SIDE ACTIVITY PANEL */}
        <div className="w-96 p-6 relative top-29">
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">✔</div>
                <div>
                  <p className="font-medium">Phonetics Quiz Completed</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">▶</div>
                <div>
                  <p className="font-medium">Lesson Watched</p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">📘</div>
                <div>
                  <p className="font-medium">Reading Practice</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
