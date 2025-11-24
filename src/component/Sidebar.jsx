import grace5 from '../assets/grace5.jpg'
function Sidebar () {
    
return (
<aside className="w-64 bg-white border-r h-screen p-6 flex flex-col gap-8">
<div className="flex items-center gap-3">
<img src={grace5} className="w-12 h-12 bg-gray-200 rounded-full" />
<div>
<h2 className="font-semibold">Temi</h2>
<p className="text-sm text-gray-500">Student</p>
</div>
</div>


<nav className="flex flex-col gap-4 text-gray-700 font-medium">
<button className="flex items-center gap-3 bg-teal-100 text-teal-700 px-4 py-2 rounded-lg">
📘 My Courses
</button>
<button className="flex items-center gap-3 hover:text-teal-600">📊 Progress</button>
<button className="flex items-center gap-3 hover:text-teal-600">🛠 Tools</button>
<button className="flex items-center gap-3 hover:text-teal-600">⚙ Settings</button>
</nav>
</aside>
);
};
export default Sidebar;