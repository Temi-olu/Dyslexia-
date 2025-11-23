import React from "react";

export default function Toolspage() {
  const bgColors = ["#e1f5f2", "#f3f4f6", "#fef9c3", "#e5e7eb"]; // teal, light gray, cream, cool gray

  return (

 <div className="min-h-screen  bg-gray-100 text-gray-900">
  {/* navbar */}
  <nav className="w-full bg-white shadow-sm py-4 px-8 flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-8 h-8 bg-teal-600 rounded-full"></div>
<h1 className="text-xl font-semibold">Dyslexia Learning Platform</h1>
</div>


<ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
<li className="hover:text-teal-600 cursor-pointer">Home</li>
<li className="hover:text-teal-600 cursor-pointer">My Courses</li>
<li className="hover:text-teal-600 cursor-pointer">Learning Tools</li>
<li className="hover:text-teal-600 cursor-pointer">Progress</li>
</ul>


<div className="w-10 h-10 rounded-full bg-gray-300"></div>
</nav>
     {/* Body */}
<div className="p-10">
      <h1 className="text-4xl font-bold mb-10">Learning Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Text to Speech */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Text-to-Speech</h2>
          <p className="text-gray-600 text-sm">Listen to any text read aloud.</p>

          <div className="flex gap-4">
            <button className="bg-teal-600 text-white rounded-xl px-4 py-2 w-full">Upload D...</button>
            <button className="bg-gray-200 rounded-xl px-4 py-2 w-full">Paste Text</button>
          </div>

          <button className="bg-orange-300 text-white rounded-xl py-3 text-lg flex items-center justify-center gap-2">
            ▶ Play
          </button>
        </div>

        {/* Font Settings */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Font Settings</h2>
          <p className="text-gray-600 text-sm">Customize text for better readability.</p>

          <label className="font-medium">Font Size</label>
          <input type="range" className="w-full" />

          <label className="font-medium">Font Style</label>
          <select className="border rounded-xl p-2 w-full">
            <option>Lexend (Default)</option>
            <option>OpenDyslexic</option>
            <option>Arial</option>
          </select>

          <label className="font-medium">Letter Spacing</label>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl border w-full bg-gray-100">Normal</button>
            <button className="px-4 py-2 rounded-xl border w-full bg-gray-100">Wide</button>
            <button className="px-4 py-2 rounded-xl border w-full bg-gray-100">Extra Wide</button>
          </div>
        </div>

        {/* Display Mode */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Display Mode</h2>
          <p className="text-gray-600 text-sm">Reduce eye strain with custom colors.</p>

          <label className="font-medium">Background Colors</label>
          <div className="flex gap-4 items-center">
            {bgColors.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                className="w-10 h-10 rounded-full border-2 border-gray-300"
              ></button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="font-medium">Dark Mode</span>
            <div className="w-11 h-6 bg-gray-300 rounded-full relative">
              <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

