import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock users database - Replace with real API later
const MOCK_USERS = [
  {
    id: 1,
    email: 'student@dyslexia.com',
    password: 'student123',
    name: 'Emma Johnson',
    role: 'student',
    grade: 5,
    readingLevel: 3.5
  },
  {
    id: 2,
    email: 'teacher@dyslexia.com',
    password: 'teacher123',
    name: 'Mr. Smith',
    role: 'teacher',
    subjects: ['English', 'Reading']
  },
  {
    id: 3,
    email: 'parent@dyslexia.com',
    password: 'parent123',
    name: 'Sarah Johnson',
    role: 'parent',
    children: ['Emma Johnson']
  },
  {
    id: 4,
    email: 'admin@dyslexia.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Generate mock JWT token
  const generateToken = (userId) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      userId, 
      exp: Date.now() + 24 * 60 * 60 * 1000
    }));
    const signature = btoa(`signature-${userId}-${Date.now()}`);
    return `${header}.${payload}.${signature}`;
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    setIsAuthenticating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!foundUser) {
        throw new Error('No account found with this email address');
      }

      if (foundUser.password !== password) {
        throw new Error('Incorrect password. Please try again');
      }

      const token = generateToken(foundUser.id);
      const { password: _, ...userWithoutPassword } = foundUser;

      if (rememberMe) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userWithoutPassword));
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userData', JSON.stringify(userWithoutPassword));
      }

      setUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };

    } catch (error) {
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticating,
    isAuthenticated,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;