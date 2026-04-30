import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';
import { WORLD_LANGUAGES } from '../Data/Translations';
import { toast } from 'sonner';

function Registerpage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [langRegion, setLangRegion] = useState('All');

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'student', grade: '', parentEmail: '', schoolName: '', subject: '', childEmail: '',
  });

  const [errors, setErrors] = useState({});
  const { register, isAuthenticating } = useAuth();
  // language applies instantly when clicked
  const { language, setLanguageNow } = useLanguage();
  const navigate = useNavigate();

  const totalSteps = 5;
  const steps = [
    { number: 0, title: "Language", icon: "🌍" },
    { number: 1, title: "Your Info", icon: "👤" },
    { number: 2, title: "Your Role", icon: "🎓" },
    { number: 3, title: "Security", icon: "🔒" },
    { number: 4, title: "Confirm", icon: "✅" },
  ];

  // Called the moment a language is clicked — immediate effect
  const handleLanguageClick = (code) => {
    setLanguageNow(code);  // instant — saves to localStorage right away
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const getPasswordStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strengthLabel = (s) => ['','Weak','Fair','Good','Strong','Very Strong'][s] || '';
  const strengthColor = (s) => ['','bg-red-400','bg-amber-400','bg-yellow-400','bg-green-400','bg-emerald-500'][s] || 'bg-gray-200';

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.name.trim() || formData.name.trim().length < 2) errs.name = 'Full name required (min 2 chars)';
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Valid email required';
    }
    if (step === 3) {
      if (!formData.password || formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
      if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 0) { setCurrentStep(1); return; }
    if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, 4));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 4) return;
    try {
      await register({
        name: formData.name.trim(), email: formData.email.trim(), password: formData.password,
        role: formData.role, grade: formData.grade, parentEmail: formData.parentEmail,
        schoolName: formData.schoolName, subject: formData.subject, childEmail: formData.childEmail,
        language,
      });
      toast.success('Account created! Welcome to Dyslexia Learn 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  const pwStrength = getPasswordStrength(formData.password);

  const filteredLangs = WORLD_LANGUAGES.filter(l => {
    const matchSearch = !langSearch ||
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.native.toLowerCase().includes(langSearch.toLowerCase());
    const matchRegion = langRegion === 'All' || l.region === langRegion;
    return matchSearch && matchRegion;
  });

  const currentLangObj = WORLD_LANGUAGES.find(l => l.code === language) || WORLD_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">

        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-teal-700 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">Dyslexia Learn</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

          {/* Step indicator */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-50">
            <div className="flex items-center justify-between mb-3">
              {steps.map((step, idx) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                    currentStep > step.number ? 'bg-teal-600 text-white' :
                    currentStep === step.number ? 'bg-orange-500 text-white ring-4 ring-orange-100' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {currentStep > step.number ? '✓' : step.icon}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${currentStep > step.number ? 'bg-teal-500' : 'bg-gray-100'}`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm font-semibold text-gray-500">
              Step {currentStep + 1} of {totalSteps} — <span className="text-gray-800">{steps[currentStep]?.title}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6">

            {/* ── STEP 0: Language ── */}
            {currentStep === 0 && (
              <div>
                <div className="text-center mb-5">
                  <div className="text-5xl mb-3">🌍</div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
                  <p className="text-gray-500 text-sm mt-1">Choose your language — it applies the moment you tap.</p>
                </div>

                {/* Selected language — updates immediately */}
                <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-4 flex items-center gap-3 mb-4">
                  <span className="text-3xl">{currentLangObj.flag}</span>
                  <div className="flex-1">
                    <p className="font-bold text-teal-800">{currentLangObj.name}</p>
                    <p className="text-sm text-teal-600">{currentLangObj.native}</p>
                  </div>
                  <span className="text-xs bg-teal-600 text-white px-2.5 py-1 rounded-full font-bold">✓ Active</span>
                </div>

                {/* Quick picks — 8 languages */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quick Select</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { code: "en", flag: "🇬🇧", name: "English",    native: "English" },
                    { code: "yo", flag: "🇳🇬", name: "Yoruba",     native: "Yorùbá" },
                    { code: "ig", flag: "🇳🇬", name: "Igbo",       native: "Igbo" },
                    { code: "ha", flag: "🇳🇬", name: "Hausa",      native: "Hausa" },
                    { code: "fr", flag: "🇫🇷", name: "French",     native: "Français" },
                    { code: "pt", flag: "🇧🇷", name: "Portuguese", native: "Português" },
                    { code: "es", flag: "🇪🇸", name: "Spanish",    native: "Español" },
                    { code: "ar", flag: "🇸🇦", name: "Arabic",     native: "العربية" },
                  ].map(l => (
                    <button type="button" key={l.code} onClick={() => handleLanguageClick(l.code)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all ${
                        language === l.code
                          ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                          : 'bg-gray-50 border-gray-200 hover:border-teal-400 hover:bg-teal-50 text-gray-700'
                      }`}>
                      <span className="text-xl">{l.flag}</span>
                      <div className="min-w-0 text-left">
                        <div className="text-xs font-bold">{l.name}</div>
                        <div className={`text-xs ${language === l.code ? 'opacity-75' : 'text-gray-400'}`}>{l.native}</div>
                      </div>
                      {language === l.code && <span className="ml-auto text-xs font-bold">✓</span>}
                    </button>
                  ))}
                </div>

                {/* Search more */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Search All Languages</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={langSearch} onChange={e => setLangSearch(e.target.value)}
                    placeholder="🔍 Search…"
                    className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
                  <select value={langRegion} onChange={e => setLangRegion(e.target.value)}
                    className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400 bg-white">
                    <option value="All">All</option>
                    {["Africa","Americas","Asia","Europe","Middle East","Oceania","Global"].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {(langSearch || langRegion !== 'All') && (
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {filteredLangs.map(lang => (
                      <button type="button" key={lang.code} onClick={() => handleLanguageClick(lang.code)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                          language === lang.code
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-gray-50 border-gray-200 hover:border-teal-400 text-gray-700'
                        }`}>
                        <span className="text-lg">{lang.flag}</span>
                        <div className="min-w-0 text-left">
                          <div className="text-xs font-semibold truncate">{lang.name}</div>
                          <div className={`text-xs truncate ${language === lang.code ? 'opacity-75' : 'text-gray-400'}`}>{lang.native}</div>
                        </div>
                        {language === lang.code && <span className="ml-auto text-xs">✓</span>}
                      </button>
                    ))}
                    {filteredLangs.length === 0 && <p className="col-span-2 text-center py-4 text-gray-400 text-sm">No languages found.</p>}
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 1: Personal ── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
                  <p className="text-gray-500 text-sm">Basic info for your account</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'}`} />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'}`} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>
            )}

            {/* ── STEP 2: Role ── */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-bold text-gray-900">What's your role?</h2>
                  <p className="text-gray-500 text-sm">This personalises your experience</p>
                </div>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {[
                    { id: 'student', emoji: '📚', label: 'Student',          desc: 'I want to improve my reading' },
                    { id: 'teacher', emoji: '🏫', label: 'Teacher',          desc: 'I teach students with dyslexia' },
                    { id: 'parent',  emoji: '👨‍👧', label: 'Parent / Guardian', desc: 'I support a child with dyslexia' },
                    { id: 'admin',   emoji: '⚙️', label: 'Admin',            desc: 'I manage courses and content' },
                  ].map(r => (
                    <button type="button" key={r.id} onClick={() => setFormData(prev => ({ ...prev, role: r.id }))}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${formData.role === r.id ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'}`}>
                      <span className="text-3xl flex-shrink-0">{r.emoji}</span>
                      <div className="flex-1">
                        <p className={`font-bold ${formData.role === r.id ? 'text-teal-700' : 'text-gray-800'}`}>{r.label}</p>
                        <p className="text-xs text-gray-500">{r.desc}</p>
                      </div>
                      {formData.role === r.id && <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-white text-xs">✓</span></div>}
                    </button>
                  ))}
                </div>
                {formData.role === 'student' && (
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Grade / Year <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="number" name="grade" value={formData.grade} onChange={handleChange} min="1" max="12" placeholder="e.g. 5"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Parent's Email <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} placeholder="parent@email.com"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400" />
                    </div>
                  </div>
                )}
                {formData.role === 'teacher' && (
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">School Name <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="Name of your school"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Subject <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. English, Special Education"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400" />
                    </div>
                  </div>
                )}
                {formData.role === 'parent' && (
                  <div className="pt-3 border-t border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Child's Email <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input type="email" name="childEmail" value={formData.childEmail} onChange={handleChange} placeholder="child@email.com"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400" />
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: Security ── */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Create a password</h2>
                  <p className="text-gray-500 text-sm">Keep your account secure</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters"
                      className={`w-full border-2 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none transition ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'}`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= pwStrength ? strengthColor(pwStrength) : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Strength: <span className="font-semibold">{strengthLabel(pwStrength)}</span></p>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password"
                      className={`w-full border-2 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none transition ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'}`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
                  )}
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {/* ── STEP 4: Confirm ── */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-5">
                  <div className="text-4xl mb-2">🎉</div>
                  <h2 className="text-2xl font-bold text-gray-900">Almost there!</h2>
                  <p className="text-gray-500 text-sm">Review your details</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3 mb-4">
                  {[
                    { label: 'Name',     value: formData.name },
                    { label: 'Email',    value: formData.email },
                    { label: 'Role',     value: formData.role.charAt(0).toUpperCase() + formData.role.slice(1) },
                    { label: 'Language', value: currentLangObj.flag + ' ' + currentLangObj.name },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span className="text-sm font-bold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400">By creating an account you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {currentStep > 0 && (
                <button type="button" onClick={prevStep}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-semibold text-sm">
                  ← Back
                </button>
              )}
              {currentStep < 4 ? (
                <button type="button" onClick={nextStep}
                  className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition font-semibold text-sm shadow-lg">
                  {currentStep === 0 ? 'Continue with ' + currentLangObj.native + ' →' : 'Continue →'}
                </button>
              ) : (
                <button type="submit" disabled={isAuthenticating}
                  className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition font-semibold text-sm shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                  {isAuthenticating ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating…</> : '🎉 Create My Account'}
                </button>
              )}
            </div>
          </form>

          <div className="px-6 pb-6 text-center border-t border-gray-50 pt-4">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registerpage;