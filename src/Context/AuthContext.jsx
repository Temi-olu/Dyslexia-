import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// LocalStorage keys
const USERS_KEY = 'dyslexia_users';
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Initialize users database in localStorage if it doesn't exist
  useEffect(() => {
    const initializeDatabase = () => {
      const existingUsers = localStorage.getItem(USERS_KEY);
      if (!existingUsers) {
        // Create empty users array
        localStorage.setItem(USERS_KEY, JSON.stringify([]));
      }
    };

    initializeDatabase();
  }, []);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userData = localStorage.getItem(USER_DATA_KEY);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          // Verify user still exists in database
          const users = getAllUsers();
          const userExists = users.find(u => u.id === parsedUser.id);
          
          if (userExists) {
            setUser(parsedUser);
          } else {
            // User was deleted, clear auth
            logout();
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Get all users from localStorage
  const getAllUsers = () => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  };

  // Save users to localStorage
  const saveUsers = (users) => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  };

  // Generate unique user ID
  const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Generate JWT token
  const generateToken = (userId) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      userId, 
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    }));
    const signature = btoa(`signature-${userId}-${Date.now()}`);
    return `${header}.${payload}.${signature}`;
  };

  // Hash password (simple for demo - use bcrypt in real production)
  const hashPassword = (password) => {
    // Simple hash for demo - in production use bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `hashed_${Math.abs(hash)}_${password.length}`;
  };

  // Verify password
  const verifyPassword = (password, hashedPassword) => {
    return hashPassword(password) === hashedPassword;
  };

  // Register function
  const register = async (userData) => {
    setIsAuthenticating(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { email, password, name, role = 'student', ...otherData } = userData;

      // Validation
      if (!email || !password || !name) {
        throw new Error('Please fill in all required fields');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if user already exists
      const users = getAllUsers();
      const existingUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: generateUserId(),
        email: email.toLowerCase(),
        password: hashPassword(password),
        name,
        role,
        ...otherData,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save to database
      users.push(newUser);
      const saved = saveUsers(users);

      if (!saved) {
        throw new Error('Failed to create account. Please try again.');
      }

      // Auto-login after registration
      const token = generateToken(newUser.id);
      const { password: _, ...userWithoutPassword } = newUser;

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userWithoutPassword));

      setUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };

    } catch (error) {
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    setIsAuthenticating(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validation
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // Find user in database
      const users = getAllUsers();
      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!foundUser) {
        throw new Error('No account found with this email address');
      }

      // Verify password
      if (!verifyPassword(password, foundUser.password)) {
        throw new Error('Incorrect password. Please try again');
      }

      // Update last login
      foundUser.lastLogin = new Date().toISOString();
      const userIndex = users.findIndex(u => u.id === foundUser.id);
      users[userIndex] = foundUser;
      saveUsers(users);

      // Generate token
      const token = generateToken(foundUser.id);
      const { password: _, ...userWithoutPassword } = foundUser;

      // Store auth data
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userWithoutPassword));

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
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const users = getAllUsers();
      const userIndex = users.findIndex(u => u.id === user.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      const updatedUser = {
        ...users[userIndex],
        ...updates,
        // Don't allow updating these fields
        id: users[userIndex].id,
        email: users[userIndex].email,
        password: users[userIndex].password,
        createdAt: users[userIndex].createdAt
      };

      users[userIndex] = updatedUser;
      saveUsers(users);

      // Update current user state
      const { password: _, ...userWithoutPassword } = updatedUser;
      setUser(userWithoutPassword);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userWithoutPassword));

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
      }

      const users = getAllUsers();
      const foundUser = users.find(u => u.id === user.id);

      if (!foundUser) {
        throw new Error('User not found');
      }

      // Verify current password
      if (!verifyPassword(currentPassword, foundUser.password)) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      foundUser.password = hashPassword(newPassword);
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex] = foundUser;
      saveUsers(users);

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  };

  // Delete account
  const deleteAccount = async (password) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const users = getAllUsers();
      const foundUser = users.find(u => u.id === user.id);

      if (!foundUser) {
        throw new Error('User not found');
      }

      // Verify password
      if (!verifyPassword(password, foundUser.password)) {
        throw new Error('Incorrect password');
      }

      // Remove user from database
      const updatedUsers = users.filter(u => u.id !== user.id);
      saveUsers(updatedUsers);

      // Logout
      logout();

      return { success: true, message: 'Account deleted successfully' };
    } catch (error) {
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Get auth token
  const getToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  };

  // Get user by ID (for admin purposes)
  const getUserById = (userId) => {
    const users = getAllUsers();
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      return userWithoutPassword;
    }
    return null;
  };

  // Get all users (for admin purposes)
  const getAllUsersPublic = () => {
    const users = getAllUsers();
    return users.map(({ password, ...user }) => user);
  };

  const value = {
    user,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    loading,
    isAuthenticating,
    isAuthenticated,
    getToken,
    getUserById,
    getAllUsers: getAllUsersPublic
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