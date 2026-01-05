import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'sonner';

function Registerpage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    grade: '',
    parentEmail: ''
  });
  
  const [errors, setErrors] = useState({});
  const { register, isAuthenticating } = useAuth();
  const navigate = useNavigate();

  const totalSteps = 4;

  // Step configurations
  const steps = [
    { number: 1, title: "Personal Info", icon: "👤" },
    { number: 2, title: "Role Selection", icon: "🎓" },
    { number: 3, title: "Security", icon: "🔒" },
    { number: 4, title: "Confirmation", icon: "✅" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 2 && formData.role === 'student') {
      if (formData.grade && (parseInt(formData.grade) < 1 || parseInt(formData.grade) > 12)) {
        newErrors.grade = 'Please enter a valid grade (1-12)';
      }
      if (formData.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
        newErrors.parentEmail = 'Please enter a valid email address';
      }
    }

    if (step === 3) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'Must contain lowercase letter';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Must contain uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Must contain a number';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'student') {
        if (formData.grade) userData.grade = parseInt(formData.grade);
        if (formData.parentEmail) userData.parentEmail = formData.parentEmail.trim().toLowerCase();
      }

      const result = await register(userData);

      if (result.success) {
        toast.success(`Welcome, ${result.user.name}!`, {
          description: 'Your account has been created successfully.',
          duration: 3000
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Registration Failed', {
        description: error.message,
        duration: 4000
      });

      if (error.message.includes('email')) {
        setCurrentStep(1);
        setErrors({ email: error.message });
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student': return '👨‍🎓';
      case 'teacher': return '👩‍🏫';
      case 'parent': return '👪';
      default: return '👤';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 p-4 py-12">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Progress Bar */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-white text-teal-700 scale-110' 
                      : 'bg-teal-500 text-white scale-100'
                  }`}>
                    {currentStep > step.number ? '✓' : step.icon}
                  </div>
                  <span className={`text-xs mt-1 font-medium hidden md:block ${
                    currentStep >= step.number ? 'text-white' : 'text-teal-200'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block h-1 flex-1 mx-2 rounded transition-all duration-500 ${
                    currentStep > step.number ? 'bg-white' : 'bg-teal-500'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          
          {/* Progress percentage */}
          <div className="w-full bg-teal-500 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {currentStep === 1 && "Let's Get Started!"}
              {currentStep === 2 && "Tell Us About You"}
              {currentStep === 3 && "Secure Your Account"}
              {currentStep === 4 && "Review & Confirm"}
            </h2>
            <p className="text-gray-600">
              {currentStep === 1 && "Enter your basic information"}
              {currentStep === 2 && "Choose your role and details"}
              {currentStep === 3 && "Create a strong password"}
              {currentStep === 4 && "Almost done! Review your information"}
            </p>
          </div>

          {/* Step Content with Animation */}
          <div className="min-h-[320px]">
            
            {/* STEP 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Temi-olu"
                    className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                    autoFocus
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="temi.email@example.com"
                    className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Role Selection */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    I am a *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['student', 'teacher', 'parent'].map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'role', value: role }})}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          formData.role === role
                            ? 'border-teal-600 bg-teal-50 scale-105'
                            : 'border-gray-300 hover:border-teal-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{getRoleIcon(role)}</div>
                        <div className="text-sm font-medium capitalize">{role}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.role === 'student' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade Level (Optional)
                      </label>
                      <input
                        type="number"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        placeholder="e.g., 5"
                        min="1"
                        max="12"
                        className={`w-full border ${errors.grade ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                      />
                      {errors.grade && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠️</span> {errors.grade}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleChange}
                        placeholder="parent@example.com"
                        className={`w-full border ${errors.parentEmail ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                      />
                      {errors.parentEmail && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠️</span> {errors.parentEmail}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 3: Security */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.password}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Must be 6+ characters with uppercase, lowercase, and number
                  </p>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(level => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded transition-all ${
                              formData.password.length >= level * 2
                                ? formData.password.length < 6
                                  ? 'bg-red-500'
                                  : formData.password.length < 8
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          ></div>
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-gray-600">
                        {formData.password.length < 6 && 'Weak password'}
                        {formData.password.length >= 6 && formData.password.length < 8 && 'Medium password'}
                        {formData.password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) && 'Strong password!'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.confirmPassword}
                    </p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <span>✓</span> Passwords match!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Review */}
            {currentStep === 4 && (
              <div className="animate-fadeIn">
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-4xl">
                      {getRoleIcon(formData.role)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="col-span-2">
                      <p className="text-gray-600 font-medium">Name</p>
                      <p className="text-gray-900 text-lg font-semibold">{formData.name}</p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-gray-600 font-medium">Email</p>
                      <p className="text-gray-900">{formData.email}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 font-medium">Role</p>
                      <p className="text-gray-900 capitalize">{formData.role}</p>
                    </div>

                    {formData.role === 'student' && formData.grade && (
                      <div>
                        <p className="text-gray-600 font-medium">Grade</p>
                        <p className="text-gray-900">{formData.grade}</p>
                      </div>
                    )}

                    {formData.role === 'student' && formData.parentEmail && (
                      <div className="col-span-2">
                        <p className="text-gray-600 font-medium">Parent Email</p>
                        <p className="text-gray-900">{formData.parentEmail}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-teal-200">
                    <p className="text-center text-sm text-gray-600">
                      By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 transition font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isAuthenticating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isAuthenticating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    🎉 Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 pb-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Registerpage;