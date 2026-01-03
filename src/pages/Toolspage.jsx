import React from "react";
import { Link } from "react-router-dom";
import grace5 from "../assets/grace5.jpg";

export default function Toolspage() {
  const bgColors = ["#e1f5f2", "#f3f4f6", "#fef9c3", "#e5e7eb"];

  /* ===============================
     GLOBAL UPDATE HELPERS
  =============================== */

  const updateFontSize = (value) => {
    localStorage.setItem("fontSize", value);
    document.documentElement.style.setProperty(
      "--app-font-size",
      `${value}px`
    );
  };

  const updateLineHeight = (value) => {
    localStorage.setItem("lineHeight", value);
    document.documentElement.style.setProperty(
      "--app-line-height",
      value
    );
  };

  const updateLetterSpacing = (value) => {
    localStorage.setItem("letterSpacing", value);
    document.documentElement.style.setProperty(
      "--app-letter-spacing",
      `${value}px`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* ===============================
          NAVBAR
      =============================== */}
      <nav className="w-full bg-white shadow-sm py-4 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
          <Link to="/">
            <h1 className="text-xl font-semibold">DyslexiaLearn</h1>
          </Link>
        </div>

        <ul className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/"><li className="hover:text-teal-600">Home</li></Link>
          <li className="hover:text-teal-600">My Courses</li>
          <li className="hover:text-teal-600">Learning Tools</li>
          <Link to="/dashboard"><li className="hover:text-teal-600">Progress</li></Link>
        </ul>

        <Link to="/profile">
          <img src={grace5} className="w-12 h-12 rounded-full" />
        </Link>
      </nav>

      {/* ===============================
          BODY
      =============================== */}
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-10">Learning Tools</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ===============================
              TEXT TO SPEECH
          =============================== */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Text-to-Speech</h2>
            <p className="text-gray-600">
              Listen to any text read aloud.
            </p>

            <div className="flex gap-4">
              <button className="bg-teal-600 text-white rounded-xl px-4 py-2 w-full">
                Upload Doc
              </button>
              <button className="bg-gray-200 rounded-xl px-4 py-2 w-full">
                Paste Text
              </button>
            </div>

            <button className="bg-orange-300 text-white rounded-xl py-3 text-lg">
              ▶ Play
            </button>
          </div>

          {/* ===============================
              FONT SETTINGS (GLOBAL)
          =============================== */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-6">
            <h2 className="text-2xl font-semibold">Font Settings</h2>
            <p className="text-gray-600">
              These changes affect the entire app.
            </p>

            {/* FONT SIZE */}
            <div>
              <label className="font-medium">Font Size</label>
              <input
                type="range"
                min="14"
                max="24"
                defaultValue={localStorage.getItem("fontSize") || 16}
                onChange={(e) => updateFontSize(e.target.value)}
                className="w-full"
              />
            </div>

            {/* LINE HEIGHT */}
            <div>
              <label className="font-medium">Line Height</label>
              <input
                type="range"
                min="1.4"
                max="2.2"
                step="0.1"
                defaultValue={localStorage.getItem("lineHeight") || 1.6}
                onChange={(e) => updateLineHeight(e.target.value)}
                className="w-full"
              />
            </div>

            {/* LETTER SPACING */}
            <div>
              <label className="font-medium">Letter Spacing</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                defaultValue={localStorage.getItem("letterSpacing") || 0.5}
                onChange={(e) => updateLetterSpacing(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* ===============================
              DISPLAY MODE
          =============================== */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Display Mode</h2>
            <p className="text-gray-600">
              Reduce eye strain with custom colors.
            </p>

            <label className="font-medium">Background Colors</label>
            <div className="flex gap-4">
              {bgColors.map((color) => (
                <button
                  key={color}
                  style={{ backgroundColor: color }}
                  className="w-10 h-10 rounded-full border"
                />
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
