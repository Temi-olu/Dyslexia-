import { useEffect } from "react";
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Registerpage from './pages/Registerpage'
import Toolspage from './pages/Toolspage'
import Dashboard from './pages/Dashboard'
import CoursePage from './pages/CoursePage'
import LessonReaderPage from './pages/LessonReaderPage'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile'
import { initReadingScale } from "./utils/readingScale";
import { AuthProvider } from './Context/AuthContext';
import { AccessibilityProvider } from './Context/AccessibilityContext';
import ProtectedRoute from './component/ProctectedRoute';
import { Toaster } from 'sonner';
import { LanguageProvider } from "./Context/LanguageContext";

function App() {
  useEffect(() => {
    initReadingScale();
  }, []);

  return (
    <div className='min-h-screen flex flex-col overflow-x-hidden bg-gray-50'>
      <LanguageProvider>
      <BrowserRouter>
        <AccessibilityProvider>
          <AuthProvider>
            {/* Toast notifications */}
            <Toaster 
              position="top-right" 
              richColors 
              closeButton
              toastOptions={{
                style: {
                  padding: '16px',
                },
              }}
            />

            <Routes>
              {/* Public Routes */}
              <Route path='/' element={<Homepage />} />
              <Route path='/login' element={<Loginpage />} />
              <Route path='/register' element={<Registerpage />} />

              {/* Protected Routes - Require Authentication */}
              <Route 
                path='/tools' 
                element={
                  <ProtectedRoute>
                    <Toolspage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path='/dashboard' 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path='/profile' 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path='/courses' 
                element={
                  <ProtectedRoute>
                    <CoursePage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path='/course/:courseId/lesson/:lessonId' 
                element={
                  <ProtectedRoute>
                    <LessonReaderPage />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Not Found */}
              <Route 
                path='*' 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                      <p className="text-xl text-gray-600 mb-8">Page not found</p>
                      <a 
                        href="/" 
                        className="bg-teal-700 text-white px-6 py-3 rounded-xl hover:bg-teal-800 transition inline-block"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </AuthProvider>
        </AccessibilityProvider>
      </BrowserRouter>
      </LanguageProvider>
    </div>
  );
}

export default App;