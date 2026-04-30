import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../component/Navbar";
import { Play, Pause, Upload, FileText, Square, Save, Check, Mic, Globe, ChevronDown } from "lucide-react";
import { useAccessibility } from "../Context/AccessibilityContext";
import { useLanguage } from "../Context/LanguageContext";
import { WORLD_LANGUAGES } from "../Data/Translations";

// CDN loader helper
const loadScript = (src, check) =>
  new Promise((resolve, reject) => {
    if (check()) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed: " + src));
    document.head.appendChild(s);
  });

const SPEEDS = [
  { label: "0.1×", v: 0.1 }, { label: "0.5×", v: 0.5 }, { label: "0.75×", v: 0.75 },
  { label: "1×", v: 1 }, { label: "1.25×", v: 1.25 }, { label: "1.5×", v: 1.5 }, { label: "2×", v: 2 },
];

const BG_COLORS = [
  { color: "#ffffff", name: "White" }, { color: "#fef9e7", name: "Cream" },
  { color: "#e3f2fd", name: "Light Blue" }, { color: "#e8f5e9", name: "Light Green" },
  { color: "#fce4ec", name: "Pale Pink" }, { color: "#f3e5f5", name: "Lavender" },
];

const FONTS = [
  { id: "OpenDyslexic", name: "OpenDyslexic", preview: "Abc 123" },
  { id: "Lexend", name: "Lexend", preview: "Abc 123" },
  { id: "Comic Neue", name: "Comic Neue", preview: "Abc 123" },
  { id: "Atkinson Hyperlegible", name: "Atkinson", preview: "Abc 123" },
];

export default function Toolspage() {
  const { fontSize, setFontSize, fontFamily, setFontFamily, bgColor, setBgColor, isDarkMode, setIsDarkMode, saveSettings } = useAccessibility();
  // language switches instantly — no pending
  const { language, setLanguageNow } = useLanguage();

  // TTS
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showArea, setShowArea] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [ttsError, setTtsError] = useState("");

  // Display
  const [selColor, setSelColor] = useState(bgColor);
  const [saveOk, setSaveOk] = useState(false);

  // Language picker
  const [langSearch, setLangSearch] = useState("");
  const [langRegion, setLangRegion] = useState("All");
  const [showLangPicker, setShowLangPicker] = useState(false);

  const fileRef = useRef(null);
  const uttRef = useRef(null);
  const keepAliveRef = useRef(null);

  useEffect(() => { setSelColor(bgColor); }, [bgColor]);
  useEffect(() => () => { cancelAll(); }, []);

  const cancelAll = () => {
    clearInterval(keepAliveRef.current);
    try { window.speechSynthesis.cancel(); } catch (_) {}
    setIsPlaying(false);
    setIsPaused(false);
  };

  const startKeepAlive = () => {
    clearInterval(keepAliveRef.current);
    keepAliveRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) { clearInterval(keepAliveRef.current); return; }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 12000);
  };

  const doSpeak = useCallback((speakText, rate) => {
    if (!speakText?.trim()) return;
    setTtsError("");
    window.speechSynthesis.cancel();
    clearInterval(keepAliveRef.current);
    setTimeout(() => {
      try {
        const utt = new SpeechSynthesisUtterance(speakText);
        utt.rate = Math.max(0.1, Math.min(10, rate));
        utt.pitch = 1;
        utt.volume = 1;
        utt.onstart  = () => { setIsPlaying(true);  setIsPaused(false); startKeepAlive(); };
        utt.onpause  = () => { setIsPlaying(false); setIsPaused(true);  clearInterval(keepAliveRef.current); };
        utt.onresume = () => { setIsPlaying(true);  setIsPaused(false); startKeepAlive(); };
        utt.onend    = () => { setIsPlaying(false); setIsPaused(false); clearInterval(keepAliveRef.current); };
        utt.onerror  = (e) => {
          clearInterval(keepAliveRef.current);
          setIsPlaying(false); setIsPaused(false);
          if (e.error !== "interrupted" && e.error !== "canceled") {
            setTtsError("Speech error: " + e.error + ". Try Chrome or Edge for best results.");
          }
        };
        uttRef.current = utt;
        window.speechSynthesis.speak(utt);
      } catch (err) {
        setTtsError("Text-to-speech is not supported in this browser. Please try Chrome or Edge.");
      }
    }, 200);
  }, []);

  const handlePlay = () => { if (!text.trim()) return; cancelAll(); setTimeout(() => doSpeak(text, speed), 50); };
  const handlePause = () => { window.speechSynthesis.pause(); setIsPlaying(false); setIsPaused(true); clearInterval(keepAliveRef.current); };
  const handleResume = () => { window.speechSynthesis.resume(); setIsPlaying(true); setIsPaused(false); startKeepAlive(); };
  const handleStop = () => cancelAll();

  const handleSpeedChange = (v) => {
    setSpeed(v);
    if (isPlaying || isPaused) { cancelAll(); setTimeout(() => doSpeak(text, v), 300); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    setFileName(file.name);
    setLoading(true);
    setTtsError("");
    setText("");
    cancelAll();

    try {
      if (["txt", "rtf", "md"].includes(ext)) {
        setLoadMsg("Reading text file…");
        const reader = new FileReader();
        reader.onload = (ev) => { setText(ev.target.result.trim()); setShowArea(true); setLoading(false); };
        reader.onerror = () => { setLoading(false); setTtsError("Could not read file."); };
        reader.readAsText(file);
      } else if (ext === "pdf") {
        setLoadMsg("Loading PDF engine…");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", () => !!window.pdfjsLib);
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const buf = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
        let full = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          setLoadMsg("Reading page " + i + " of " + pdf.numPages + "…");
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((it) => it.str).join(" ");
          if (pageText.trim()) full += pageText + "\n\n";
        }
        if (!full.trim()) { setTtsError("This PDF has no selectable text. Only text-based PDFs can be read aloud."); setLoading(false); return; }
        setText(full.trim()); setShowArea(true); setLoading(false);
      } else if (["docx", "doc"].includes(ext)) {
        setLoadMsg("Loading Word reader…");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js", () => !!window.mammoth);
        setLoadMsg("Extracting text…");
        const buf = await file.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
        if (!result.value.trim()) { setTtsError("No readable text found in this document."); setLoading(false); return; }
        setText(result.value.trim()); setShowArea(true); setLoading(false);
      } else {
        setLoading(false);
        setTtsError("Unsupported: ." + ext + " — use .pdf, .docx, .doc, .txt, or .md");
        setFileName("");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setTtsError("Error reading file. Try another file.");
    }
    e.target.value = "";
  };

  // Save only font/color/size — language already saved instantly on click
  const handleSave = () => {
    saveSettings();
    setSaveOk(true);
    setTimeout(() => setSaveOk(false), 2500);
  };

  const handleBgColor = (c) => { setSelColor(c); setBgColor(c); if (isDarkMode) setIsDarkMode(false); };
  const toggleDark = () => { setIsDarkMode(!isDarkMode); const c = isDarkMode ? "#ffffff" : "#1e1e1e"; setSelColor(c); setBgColor(c); };

  // Language click → immediate save via setLanguageNow
  const handleLanguageSelect = (code) => {
    setLanguageNow(code);          // saves immediately to localStorage + state
    setShowLangPicker(false);
    setLangSearch("");
    setLangRegion("All");
  };

  const filteredLangs = WORLD_LANGUAGES.filter(l => {
    const matchSearch = !langSearch || l.name.toLowerCase().includes(langSearch.toLowerCase()) || l.native.toLowerCase().includes(langSearch.toLowerCase());
    const matchRegion = langRegion === "All" || l.region === langRegion;
    return matchSearch && matchRegion;
  });

  const currentLangObj = WORLD_LANGUAGES.find(l => l.code === language) || WORLD_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Learning Tools</h1>
            <p className="text-gray-500 mt-1 text-sm">Language saves instantly. Font &amp; display save when you click <strong>Save Settings</strong>.</p>
          </div>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all shadow-sm ${saveOk ? "bg-green-600 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"}`}>
            {saveOk ? <><Check className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Settings</>}
          </button>
        </div>

        {/* ── LANGUAGE PICKER — full width, prominent ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Interface Language</h2>
                <p className="text-xs text-green-600 font-medium">✓ Saves instantly when you select</p>
              </div>
            </div>
            {/* Current language badge */}
            <button onClick={() => setShowLangPicker(!showLangPicker)}
              className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-teal-700 transition shadow-sm">
              <span className="text-xl">{currentLangObj.flag}</span>
              <span>{currentLangObj.native}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showLangPicker ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Always show 6 quick-pick languages when picker is closed */}
          {!showLangPicker && (
            <div className="flex gap-2 flex-wrap">
              {[
                { code: "en", flag: "🇬🇧", native: "English" },
                { code: "yo", flag: "🇳🇬", native: "Yorùbá" },
                { code: "ig", flag: "🇳🇬", native: "Igbo" },
                { code: "ha", flag: "🇳🇬", native: "Hausa" },
                { code: "fr", flag: "🇫🇷", native: "Français" },
                { code: "pt", flag: "🇧🇷", native: "Português" },
                { code: "ar", flag: "🇸🇦", native: "العربية" },
                { code: "es", flag: "🇪🇸", native: "Español" },
              ].map(l => (
                <button key={l.code} onClick={() => handleLanguageSelect(l.code)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    language === l.code
                      ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-400 hover:bg-teal-50"
                  }`}>
                  <span>{l.flag}</span><span>{l.native}</span>
                  {language === l.code && <span className="ml-0.5">✓</span>}
                </button>
              ))}
              <button onClick={() => setShowLangPicker(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-400 hover:border-teal-400 hover:text-teal-600 transition-all">
                + More languages
              </button>
            </div>
          )}

          {/* Full picker */}
          {showLangPicker && (
            <div>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input type="text" value={langSearch} onChange={e => setLangSearch(e.target.value)}
                  placeholder="🔍 Search language or native name…"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
                  autoFocus />
                <select value={langRegion} onChange={e => setLangRegion(e.target.value)}
                  className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 bg-white">
                  <option value="All">🌍 All Regions</option>
                  {["Africa","Americas","Asia","Europe","Middle East","Oceania","Global","Historical"].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
                {filteredLangs.map(lang => (
                  <button key={lang.code} onClick={() => handleLanguageSelect(lang.code)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all border text-sm ${
                      language === lang.code
                        ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                        : "bg-gray-50 hover:bg-teal-50 border-gray-200 hover:border-teal-300 text-gray-700"
                    }`}>
                    <span className="text-xl flex-shrink-0">{lang.flag}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs truncate">{lang.name}</div>
                      <div className={`text-xs truncate ${language === lang.code ? "opacity-75" : "text-gray-400"}`}>{lang.native}</div>
                    </div>
                    {language === lang.code && <span className="ml-auto text-xs">✓</span>}
                  </button>
                ))}
                {filteredLangs.length === 0 && <p className="col-span-full text-center py-8 text-gray-400 text-sm">No languages match.</p>}
              </div>
              <button onClick={() => setShowLangPicker(false)} className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition">✕ Close</button>
            </div>
          )}
        </div>

        {/* ── 3-column row: TTS + Font + Display ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* TEXT TO SPEECH */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Mic className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Text-to-Speech</h2>
            </div>
            <p className="text-gray-400 text-xs mb-4">Upload a document or paste text, then press Play.</p>

            <input ref={fileRef} type="file" onChange={handleFileUpload} accept=".txt,.pdf,.doc,.docx,.md,.rtf" className="hidden" />
            <div className="flex gap-2 mb-3">
              <button onClick={() => fileRef.current.click()} disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-2xl py-2.5 text-sm font-semibold transition flex items-center justify-center gap-1.5">
                <Upload className="w-4 h-4" />{loading ? "Reading…" : "Upload File"}
              </button>
              <button onClick={() => { setShowArea(!showArea); if (!showArea) setFileName(""); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl py-2.5 text-sm font-semibold transition flex items-center justify-center gap-1.5">
                <FileText className="w-4 h-4" />Paste Text
              </button>
            </div>

            <div className="flex gap-1 flex-wrap mb-3">
              {[".pdf",".docx",".doc",".txt",".md"].map(e => (
                <span key={e} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">{e}</span>
              ))}
            </div>

            {loading && (
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2.5 mb-3">
                <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="text-sm text-blue-700">{loadMsg}</span>
              </div>
            )}

            {fileName && !loading && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-3">
                <FileText className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span className="text-xs text-green-700 font-medium truncate">{fileName}</span>
                <button onClick={() => { setFileName(""); setText(""); setShowArea(false); cancelAll(); }} className="ml-auto text-green-400 hover:text-red-500 font-bold">✕</button>
              </div>
            )}

            {ttsError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-3">
                <p className="text-xs text-red-700">{ttsError}</p>
              </div>
            )}

            {showArea && (
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste or type text here…"
                className="w-full h-28 p-3 border-2 border-gray-200 rounded-2xl mb-3 resize-none focus:outline-none focus:border-teal-500 text-sm" />
            )}

            {/* Speed buttons */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Speed</p>
              <div className="flex flex-wrap gap-1.5">
                {SPEEDS.map(s => (
                  <button key={s.v} onClick={() => handleSpeedChange(s.v)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                      speed === s.v ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                    }`}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex gap-2">
              {!isPlaying && !isPaused ? (
                <button onClick={handlePlay} disabled={!text.trim()}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                    !text.trim() ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}>
                  <Play className="w-4 h-4" fill="currentColor" />Play
                </button>
              ) : isPaused ? (
                <button onClick={handleResume} className="flex-1 py-3 rounded-2xl font-bold text-sm bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 transition">
                  <Play className="w-4 h-4" fill="currentColor" />Resume
                </button>
              ) : (
                <button onClick={handlePause} className="flex-1 py-3 rounded-2xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2 transition">
                  <Pause className="w-4 h-4" fill="currentColor" />Pause
                </button>
              )}
              {(isPlaying || isPaused) && (
                <button onClick={handleStop} className="py-3 px-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white transition">
                  <Square className="w-4 h-4" fill="currentColor" />
                </button>
              )}
            </div>

            {(isPlaying || isPaused) && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-amber-400"}`} />
                <span className="text-xs text-gray-500">{isPlaying ? "Playing" : "Paused"} · {speed}×</span>
              </div>
            )}
          </div>

          {/* FONT SETTINGS */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Font Settings</h2>
            <p className="text-gray-400 text-xs mb-5">Click <strong>Save Settings</strong> to apply.</p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Font Size — <span className="text-teal-600">{fontSize}px</span></label>
              <input type="range" min="12" max="28" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-500" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>12px</span><span>28px</span></div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Font Family</label>
              <div className="grid grid-cols-2 gap-2">
                {FONTS.map(f => (
                  <button key={f.id} onClick={() => setFontFamily(f.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${fontFamily === f.id ? "bg-teal-600 border-teal-600 text-white" : "border-gray-200 hover:border-teal-400 text-gray-800"}`}>
                    <div className="text-xs font-bold mb-0.5">{f.name}</div>
                    <div className="text-base opacity-75" style={{ fontFamily: f.id }}>{f.preview}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DISPLAY MODE */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Display Mode</h2>
            <p className="text-gray-400 text-xs mb-5">Click <strong>Save Settings</strong> to apply.</p>
            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-3">Background Colour</label>
              <div className="grid grid-cols-3 gap-2">
                {BG_COLORS.map(({ color, name }) => (
                  <button key={color} onClick={() => handleBgColor(color)} title={name}
                    className={`h-10 rounded-xl border-2 transition-all hover:scale-105 relative ${selColor === color && !isDarkMode ? "border-gray-800 ring-2 ring-gray-300" : "border-gray-200"}`}
                    style={{ backgroundColor: color }}>
                    {selColor === color && !isDarkMode && <span className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <p className="font-bold text-gray-800 text-sm">Dark Mode</p>
                <p className="text-xs text-gray-400">Reduces glare in low light</p>
              </div>
              <button onClick={toggleDark} className={`relative w-12 h-7 rounded-full transition-colors ${isDarkMode ? "bg-teal-600" : "bg-gray-200"}`}>
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${isDarkMode ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm text-blue-800"><strong>🌍 Language:</strong> Click any language above and it applies immediately — no save needed!</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-sm text-amber-800"><strong>⏸️ Controls:</strong> Pause anytime, Resume where you left off. Change speed mid-playback — it restarts instantly.</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
            <p className="text-sm text-purple-800"><strong>💾 Save:</strong> Font size, font family, and background colour need the <strong>Save Settings</strong> button.</p>
          </div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Comic+Neue:wght@400;700&family=Atkinson+Hyperlegible:wght@400;700&display=swap');
        @font-face { font-family:'OpenDyslexic'; src:url('https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@master/compiled/OpenDyslexic-Regular.otf') format('opentype'); }
      `}</style>
    </div>
  );
}