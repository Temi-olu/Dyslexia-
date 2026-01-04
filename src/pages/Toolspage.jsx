// import React from "react";
// import { Link } from "react-router-dom";
// import grace5 from "../assets/grace5.jpg";

// export default function Toolspage() {
//   const bgColors = ["#e1f5f2", "#f3f4f6", "#fef9c3", "#e5e7eb"];

//   /* ===============================
//      GLOBAL UPDATE HELPERS
//   =============================== */

//   const updateFontSize = (value) => {
//     localStorage.setItem("fontSize", value);
//     document.documentElement.style.setProperty(
//       "--app-font-size",
//       `${value}px`
//     );
//   };

//   const updateLineHeight = (value) => {
//     localStorage.setItem("lineHeight", value);
//     document.documentElement.style.setProperty(
//       "--app-line-height",
//       value
//     );
//   };

//   const updateLetterSpacing = (value) => {
//     localStorage.setItem("letterSpacing", value);
//     document.documentElement.style.setProperty(
//       "--app-letter-spacing",
//       `${value}px`
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-900">
//       {/* ===============================
//           NAVBAR
//       =============================== */}
//       <nav className="w-full bg-white shadow-sm py-4 px-8 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
//           <Link to="/">
//             <h1 className="text-xl font-semibold">DyslexiaLearn</h1>
//           </Link>
//         </div>

//         <ul className="hidden md:flex items-center gap-8 font-medium">
//           <Link to="/"><li className="hover:text-teal-600">Home</li></Link>
//           <li className="hover:text-teal-600">My Courses</li>
//           <li className="hover:text-teal-600">Learning Tools</li>
//           <Link to="/dashboard"><li className="hover:text-teal-600">Progress</li></Link>
//         </ul>

//         <Link to="/profile">
//           <img src={grace5} className="w-12 h-12 rounded-full" />
//         </Link>
//       </nav>

//       {/* ===============================
//           BODY
//       =============================== */}
//       <div className="p-10">
//         <h1 className="text-4xl font-bold mb-10">Learning Tools</h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

//           {/* ===============================
//               TEXT TO SPEECH
//           =============================== */}
//           <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
//             <h2 className="text-2xl font-semibold">Text-to-Speech</h2>
//             <p className="text-gray-600">
//               Listen to any text read aloud.
//             </p>

//             <div className="flex gap-4">
//               <button className="bg-teal-600 text-white rounded-xl px-4 py-2 w-full">
//                 Upload Doc
//               </button>
//               <button className="bg-gray-200 rounded-xl px-4 py-2 w-full">
//                 Paste Text
//               </button>
//             </div>

//             <button className="bg-orange-300 text-white rounded-xl py-3 text-lg">
//               ▶ Play
//             </button>
//           </div>

//           {/* ===============================
//               FONT SETTINGS (GLOBAL)
//           =============================== */}
//           <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-6">
//             <h2 className="text-2xl font-semibold">Font Settings</h2>
//             <p className="text-gray-600">
//               These changes affect the entire app.
//             </p>

//             {/* FONT SIZE */}
//             <div>
//               <label className="font-medium">Font Size</label>
//               <input
//                 type="range"
//                 min="14"
//                 max="24"
//                 defaultValue={localStorage.getItem("fontSize") || 16}
//                 onChange={(e) => updateFontSize(e.target.value)}
//                 className="w-full"
//               />
//             </div>

//             {/* LINE HEIGHT */}
//             <div>
//               <label className="font-medium">Line Height</label>
//               <input
//                 type="range"
//                 min="1.4"
//                 max="2.2"
//                 step="0.1"
//                 defaultValue={localStorage.getItem("lineHeight") || 1.6}
//                 onChange={(e) => updateLineHeight(e.target.value)}
//                 className="w-full"
//               />
//             </div>

//             {/* LETTER SPACING */}
//             <div>
//               <label className="font-medium">Letter Spacing</label>
//               <input
//                 type="range"
//                 min="0"
//                 max="2"
//                 step="0.1"
//                 defaultValue={localStorage.getItem("letterSpacing") || 0.5}
//                 onChange={(e) => updateLetterSpacing(e.target.value)}
//                 className="w-full"
//               />
//             </div>
//           </div>

//           {/* ===============================
//               DISPLAY MODE
//           =============================== */}
//           <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
//             <h2 className="text-2xl font-semibold">Display Mode</h2>
//             <p className="text-gray-600">
//               Reduce eye strain with custom colors.
//             </p>

//             <label className="font-medium">Background Colors</label>
//             <div className="flex gap-4">
//               {bgColors.map((color) => (
//                 <button
//                   key={color}
//                   style={{ backgroundColor: color }}
//                   className="w-10 h-10 rounded-full border"
//                 />
//               ))}
//             </div>

//             <div className="flex items-center justify-between mt-4">
//               <span className="font-medium">Dark Mode</span>
//               <div className="w-11 h-6 bg-gray-300 rounded-full relative">
//                 <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow"></div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
// pages/Toolspage.jsx - FULLY FUNCTIONAL & RESPONSIVE MATCHING MOCKUP
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { Play, Upload, FileText, Pause, Square } from "lucide-react";

export default function Toolspage() {
  // ==================== TEXT-TO-SPEECH STATE ====================
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const fileInputRef = useRef(null);

  // ==================== FONT SETTINGS STATE ====================
  const [fontSize, setFontSize] = useState(
    parseInt(localStorage.getItem("fontSize")) || 16
  );
  const [lineHeight, setLineHeight] = useState(
    parseFloat(localStorage.getItem("lineHeight")) || 1.6
  );
  const [letterSpacing, setLetterSpacing] = useState(
    parseFloat(localStorage.getItem("letterSpacing")) || 0.5
  );

  // ==================== DISPLAY MODE STATE ====================
  const [selectedBgColor, setSelectedBgColor] = useState(
    localStorage.getItem("bgColor") || "#ffffff"
  );
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Background colors matching mockup
  const bgColors = [
    { color: "#e0f2f1", name: "Teal" },      // Light teal
    { color: "#ffffff", name: "White" },     // White
    { color: "#fffde7", name: "Cream" },     // Light cream
    { color: "#e1f5fe", name: "Blue" },      // Light blue
  ];

  // ==================== APPLY SETTINGS ON LOAD ====================
  useEffect(() => {
    applyFontSettings();
    applyTheme();
  }, []);

  // ==================== TEXT-TO-SPEECH FUNCTIONS ====================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      alert("Please upload a .txt file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target.result);
      setShowTextInput(true);
    };
    reader.readAsText(file);
  };

  const handlePasteText = () => {
    setShowTextInput(true);
  };

  const handlePlay = () => {
    if (!text.trim()) {
      alert("Please enter some text or upload a document first!");
      return;
    }

    if (isPlaying) {
      synth.current.cancel();
      setIsPlaying(false);
    } else {
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.rate = 1;
      utteranceRef.current.pitch = 1;
      utteranceRef.current.volume = 1;
      utteranceRef.current.onend = () => setIsPlaying(false);
      utteranceRef.current.onerror = () => {
        setIsPlaying(false);
        alert("An error occurred while reading the text.");
      };

      synth.current.speak(utteranceRef.current);
      setIsPlaying(true);
    }
  };

  // ==================== FONT SETTINGS FUNCTIONS ====================
  const applyFontSettings = () => {
    document.documentElement.style.setProperty("--app-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--app-line-height", lineHeight);
    document.documentElement.style.setProperty("--app-letter-spacing", `${letterSpacing}px`);
  };

  const updateFontSize = (value) => {
    const size = parseInt(value);
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    document.documentElement.style.setProperty("--app-font-size", `${size}px`);
  };

  const updateLineHeight = (value) => {
    const height = parseFloat(value);
    setLineHeight(height);
    localStorage.setItem("lineHeight", height);
    document.documentElement.style.setProperty("--app-line-height", height);
  };

  const updateLetterSpacing = (value) => {
    const spacing = parseFloat(value);
    setLetterSpacing(spacing);
    localStorage.setItem("letterSpacing", spacing);
    document.documentElement.style.setProperty("--app-letter-spacing", `${spacing}px`);
  };

  // ==================== THEME FUNCTIONS ====================
  const applyTheme = () => {
    const dark = localStorage.getItem("darkMode") === "true";
    const bg = localStorage.getItem("bgColor") || "#ffffff";
    
    if (dark) {
      document.body.style.backgroundColor = "#1f2937";
      document.body.style.color = "#f3f4f6";
    } else {
      document.body.style.backgroundColor = bg;
      document.body.style.color = "#111827";
    }
  };

  const handleBgColorChange = (color) => {
    setSelectedBgColor(color);
    localStorage.setItem("bgColor", color);
    if (!isDarkMode) {
      document.body.style.backgroundColor = color;
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    
    if (newMode) {
      document.body.style.backgroundColor = "#1f2937";
      document.body.style.color = "#f3f4f6";
    } else {
      document.body.style.backgroundColor = selectedBgColor;
      document.body.style.color = "#111827";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          Learning Tools
        </h1>

        {/* Three Column Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ==================== TEXT-TO-SPEECH CARD ==================== */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">
              Text-to-Speech
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Listen to any text read aloud.
            </p>

            {/* Upload & Paste Buttons */}
            <div className="flex gap-3 mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-medium transition-all"
              >
                Upload Doc
              </button>
              <button
                onClick={handlePasteText}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl font-medium transition-all"
              >
                Paste Text
              </button>
            </div>

            {/* Text Input Area (shown when Paste Text clicked) */}
            {showTextInput && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-32 p-4 mb-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm"
              />
            )}

            {/* Play Button */}
            <button
              onClick={handlePlay}
              className="w-full py-4 bg-orange-400 hover:bg-orange-500 text-white rounded-2xl font-medium transition-all flex items-center justify-center gap-2 text-lg"
            >
              {isPlaying ? (
                <>
                  <Square className="w-5 h-5" fill="currentColor" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" fill="currentColor" />
                  Play
                </>
              )}
            </button>
          </div>

          {/* ==================== FONT SETTINGS CARD ==================== */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">
              Font Settings
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              These changes affect the entire app.
            </p>

            {/* Font Size Slider */}
            <div className="mb-8">
              <label className="block font-semibold text-gray-900 mb-3">
                Font Size
              </label>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => updateFontSize(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-red"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((fontSize - 12) / (24 - 12)) * 100}%, #e5e7eb ${((fontSize - 12) / (24 - 12)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>12px</span>
                <span className="font-semibold text-gray-900">{fontSize}px</span>
                <span>24px</span>
              </div>
            </div>

            {/* Line Height Slider */}
            <div className="mb-8">
              <label className="block font-semibold text-gray-900 mb-3">
                Line Height
              </label>
              <input
                type="range"
                min="1.2"
                max="2.4"
                step="0.1"
                value={lineHeight}
                onChange={(e) => updateLineHeight(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((lineHeight - 1.2) / (2.4 - 1.2)) * 100}%, #e5e7eb ${((lineHeight - 1.2) / (2.4 - 1.2)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1.2</span>
                <span className="font-semibold text-gray-900">{lineHeight.toFixed(1)}</span>
                <span>2.4</span>
              </div>
            </div>

            {/* Letter Spacing Slider */}
            <div>
              <label className="block font-semibold text-gray-900 mb-3">
                Letter Spacing
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={letterSpacing}
                onChange={(e) => updateLetterSpacing(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(letterSpacing / 3) * 100}%, #e5e7eb ${(letterSpacing / 3) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0px</span>
                <span className="font-semibold text-gray-900">{letterSpacing.toFixed(1)}px</span>
                <span>3px</span>
              </div>
            </div>
          </div>

          {/* ==================== DISPLAY MODE CARD ==================== */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">
              Display Mode
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Reduce eye strain with custom colors.
            </p>

            {/* Background Colors */}
            <div className="mb-8">
              <label className="block font-semibold text-gray-900 mb-4">
                Background Colors
              </label>
              <div className="flex gap-4">
                {bgColors.map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => handleBgColorChange(color)}
                    className={`w-16 h-16 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedBgColor === color
                        ? 'border-gray-900 ring-4 ring-gray-200'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={name}
                  >
                    {selectedBgColor === color && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-900 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  isDarkMode ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Info Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Upload a .txt file or paste text to use Text-to-Speech
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <p className="text-sm text-green-800">
              <strong>✨ Note:</strong> Font settings apply globally across all pages
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
            <p className="text-sm text-purple-800">
              <strong>🎨 Try:</strong> Cream or teal backgrounds reduce eye strain
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom Slider Styles */}
      <style jsx>{`
        /* Custom slider thumb */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        input[type="range"]::-moz-range-thumb:hover {
          background: #dc2626;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}