
import Lessondata from '../Data/Lessondata';
import { useState } from 'react';
 function CoursesPage() {
   const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = Lessondata.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
<div>

    <div className=" bg-gray-50 min-h-screen p-5 ml-30">
    <h1 className='font-bold text-2xl mb-1 '>Available Courses</h1>
       <p className='mb-3'>Explore new skills and continue your learning journey.</p>
            {/* SEARCH + FILTERS */}
      <div className="flex items-center gap-4 px-10 mt-6 flex-wrap">
        <div className="flex items-center bg-white shadow rounded-xl px-4 py-2 w-full md:w-1/2">
          <span className="text-gray-500 mr-2 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>

        <select className="bg-white shadow px-3 py-2 rounded-xl text-gray-700">
          <option>Category</option>
        </select>

        <select className="bg-white shadow px-3 py-2 rounded-xl text-gray-700">
          <option>Difficulty</option>
        </select>
      </div>
 <div className="flex items-center gap-4">
        <button className="text-gray-600">My Courses</button>
        <button className="text-gray-600">Dashboard</button>

        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center font-semibold text-white">
          TO
        </div>
      </div>

      {/* COURSES GRID */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-10">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white shadow rounded-2xl overflow-hidden"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {course.description}
                </p>

                <button
                  className={`mt-4 w-full py-2 rounded-xl text-white font-medium
                    ${
                      course.status === "progress"
                        ? "bg-orange-400"
                        : "bg-teal-600"
                    }`}
                >
                  {course.status === "progress"
                    ? "Continue Learning"
                    : "Start Course"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center text-lg">
            No courses found.
          </p>
        )}
      </div>




    </div>
    </div>
  );
}
export default CoursesPage;