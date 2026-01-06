import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { Play, Upload, FileText, Pause, Square, Save, Check } from "lucide-react";
import { useAccessibility } from "../Context/AccessibilityContext";

export default function Toolspage() {
  // Get accessibility context
  const {
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    bgColor,
    setBgColor,
    isDarkMode,
    setIsDarkMode,
    saveSettings
  } = useAccessibility();

  // ==================== TEXT-TO-SPEECH STATE ====================
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const fileInputRef = useRef(null);

  // ==================== DISPLAY MODE STATE ====================
  const [selectedBgColor, setSelectedBgColor] = useState(bgColor);

  const bgColors = [
    { color: "#ffffff", name: "White" },
    { color: "#fef9e7", name: "Cream" },
    { color: "#e3f2fd", name: "Light Blue" },
    { color: "#e8f5e9", name: "Light Green" },
  ];

  const fonts = [
    { id: "OpenDyslexic", name: "OpenDyslexic", preview: "Abc 123" },
    { id: "Lexend", name: "Lexend", preview: "Abc 123" },
    { id: "Comic Neue", name: "Comic Neue", preview: "Abc 123" },
    { id: "Atkinson Hyperlegible", name: "Atkinson", preview: "Abc 123" },
  ];

  // ==================== TEXT-TO-SPEECH FUNCTIONS ====================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
        setShowTextInput(true);
      };
      reader.readAsText(file);
    }
  };

  const handlePasteText = () => {
    setShowTextInput(!showTextInput);
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      synth.current.cancel();
      setIsPlaying(false);
    } else if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlaying(false);
      utteranceRef.current = utterance;
      synth.current.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      synth.current.cancel();
    };
  }, []);

  // ==================== FONT SETTINGS FUNCTIONS ====================
  const updateFontSize = (value) => {
    setFontSize(parseInt(value));
  };

  const updateFontFamily = (font) => {
    setFontFamily(font);
  };

  // ==================== DISPLAY MODE FUNCTIONS ====================
  const handleBgColorChange = (color) => {
    setSelectedBgColor(color);
    setBgColor(color);
    if (isDarkMode) {
      setIsDarkMode(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      setSelectedBgColor("#1e1e1e");
      setBgColor("#1e1e1e");
    } else {
      setSelectedBgColor("#ffffff");
      setBgColor("#ffffff");
    }
  };

  // ==================== SAVE SETTINGS ====================
  const handleSaveSettings = () => {
    const success = saveSettings();
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-0">
            Learning Tools
          </h1>
          
          {/* Save Settings Button */}
          <button
            onClick={handleSaveSettings}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
              saveSuccess
                ? 'bg-green-600 text-white'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-5 h-5" />
                Settings Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ==================== TEXT-TO-SPEECH CARD ==================== */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">
              Text-to-Speech
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Listen to any text read aloud.
            </p>

            {/* Upload and Paste Buttons */}
            <div className="flex gap-3 mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-3 px-4 font-medium transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Doc
              </button>
              <button
                onClick={handlePasteText}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-2xl py-3 px-4 font-medium transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Paste Text
              </button>
            </div>

            {/* Text Input Area */}
            {showTextInput && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-32 p-3 border-2 border-gray-200 rounded-2xl mb-4 resize-none focus:outline-none focus:border-teal-600"
              />
            )}

            {/* Play Button */}
            <button
              onClick={toggleSpeech}
              disabled={!text}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                !text
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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

            {/* Font Family Selector */}
            <div>
              <label className="block font-semibold text-gray-900 mb-3">
                Font Family
              </label>
              <div className="grid grid-cols-2 gap-3">
                {fonts.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => updateFontFamily(font.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      fontFamily === font.id
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white border-gray-300 hover:border-teal-600 text-gray-900'
                    }`}
                    style={fontFamily === font.id ? {} : { fontFamily: font.id }}
                  >
                    <div className="font-medium text-sm mb-1">{font.name}</div>
                    <div className="text-lg opacity-80" style={{ fontFamily: font.id }}>
                      {font.preview}
                    </div>
                  </button>
                ))}
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
                      selectedBgColor === color && !isDarkMode
                        ? 'border-gray-900 ring-4 ring-gray-200'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={name}
                  >
                    {selectedBgColor === color && !isDarkMode && (
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
              <strong>✨ Note:</strong> Click "Save Settings" to apply changes globally across all pages
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
            <p className="text-sm text-purple-800">
              <strong>🎨 Try:</strong> OpenDyslexic font is specially designed for dyslexia
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom Slider Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Comic+Neue:wght@400;700&family=Atkinson+Hyperlegible:wght@400;700&display=swap');
        
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@master/compiled/OpenDyslexic-Regular.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
        }

        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@master/compiled/OpenDyslexic-Bold.otf') format('opentype');
          font-weight: bold;
          font-style: normal;
        }

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