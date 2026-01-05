import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Sidebar from '../component/Sidebar';
import { toast } from 'sonner';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dynamic user stats (stored in localStorage per user)
  const [userStats, setUserStats] = useState({
    coursesCompleted: 0,
    totalCourses: 15,
    wordsLearned: 0,
    learningStreak: 0,
    weeklyProgress: [20, 35, 45, 55, 70, 80, 90], // Last 7 days
    recentActivity: []
  });

  // Load user-specific stats from localStorage
  useEffect(() => {
    if (user) {
      const statsKey = `user_stats_${user.id}`;
      const savedStats = localStorage.getItem(statsKey);
      
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      } else {
        // Initialize stats for new user
        const initialStats = {
          coursesCompleted: Math.floor(Math.random() * 5) + 1,
          totalCourses: 15,
          wordsLearned: Math.floor(Math.random() * 100) + 50,
          learningStreak: Math.floor(Math.random() * 20) + 1,
          weeklyProgress: [20, 35, 45, 55, 70, 80, 90],
          recentActivity: [
            {
              id: 1,
              title: 'Phonetics Quiz Completed',
              description: 'Introduction to Vowels',
              time: '2 hours ago',
              icon: '✓',
              type: 'quiz'
            },
            {
              id: 2,
              title: 'Lesson Watched',
              description: 'Syllable Division Rules',
              time: 'Yesterday',
              icon: '▶',
              type: 'video'
            },
            {
              id: 3,
              title: 'Reading Practice',
              description: '"The Quiet Forest" story',
              time: '3 days ago',
              icon: '📘',
              type: 'reading'
            }
          ]
        };
        setUserStats(initialStats);
        localStorage.setItem(statsKey, JSON.stringify(initialStats));
      }
    }
  }, [user]);

  // Calculate progress percentage
  const progressPercentage = Math.round((userStats.coursesCompleted / userStats.totalCourses) * 100);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Handle continue learning
  const handleContinueLearning = () => {
    toast.success('Redirecting to your next lesson...');
    setTimeout(() => navigate('/courses'), 500);
  };

  // Add new activity (demo function)
  const addActivity = (activity) => {
    const newStats = {
      ...userStats,
      recentActivity: [activity, ...userStats.recentActivity.slice(0, 4)]
    };
    setUserStats(newStats);
    localStorage.setItem(`user_stats_${user.id}`, JSON.stringify(newStats));
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return '?';
    const names = user.name.split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-sm py-4 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
            DL
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Dyslexia Learning Platform</h1>
        </div>

        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li className="cursor-pointer text-teal-600 font-semibold border-b-2 border-teal-600 pb-1">
            Dashboard
          </li>
          <Link to='/courses'>
            <li className="cursor-pointer hover:text-teal-600 transition">Courses</li>
          </Link>
          <Link to='/tools'>
            <li className="cursor-pointer hover:text-teal-600 transition">Tools</li>
          </Link>
        </ul>

        <div className="flex items-center gap-4">
          <Link to='/profile'>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition">
              {getUserInitials()}
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-teal-600 hover:text-teal-600 transition group"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT LAYOUT */}
      <div className="flex flex-1">
        
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* MAIN DASHBOARD CONTENT AREA */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {getGreeting()}, {user.name?.split(' ')[0] || 'Friend'}! 👋
            </h1>
            <p className="text-gray-600">
              It's great to see you again. Let's keep learning!
            </p>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{userStats.coursesCompleted}</p>
              <p className="text-sm text-gray-600 mt-1">Courses Completed</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{userStats.wordsLearned}</p>
              <p className="text-sm text-gray-600 mt-1">Words Mastered</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{userStats.learningStreak}</p>
              <p className="text-sm text-gray-600 mt-1">Day Streak 🔥</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{progressPercentage}%</p>
              <p className="text-sm text-gray-600 mt-1">Overall Progress</p>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm mb-8 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Learning Progress</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You've completed {userStats.coursesCompleted} out of {userStats.totalCourses} courses
                </p>
              </div>
              <div className="text-3xl font-bold text-orange-500">{progressPercentage}%</div>
            </div>

            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <p className="text-gray-600 mt-4 flex items-center gap-2">
              <span className="text-green-600 font-medium">Keep up the great work!</span>
              <span>🎉</span>
            </p>
          </div>

          {/* Weekly Activity Chart */}
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm mb-8 max-w-4xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">This Week's Activity</h3>
            <div className="flex items-end justify-between gap-3 h-40">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden flex items-end" style={{ height: '100%' }}>
                    <div 
                      className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all duration-500 hover:from-teal-600 hover:to-teal-500 cursor-pointer"
                      style={{ height: `${userStats.weeklyProgress[index]}%` }}
                      title={`${userStats.weeklyProgress[index]}% progress`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 max-w-4xl">
            <button 
              onClick={handleContinueLearning}
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:from-teal-700 hover:to-teal-800 transition shadow-lg hover:shadow-xl group"
            >
              <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="font-semibold">Continue Learning</span>
            </button>

            <Link to="/courses">
              <button className="bg-white border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-teal-50 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-semibold">Browse Courses</span>
              </button>
            </Link>
          </div>

        </div>

        {/* RIGHT SIDE ACTIVITY PANEL */}
        <div className="hidden lg:block w-96 p-6 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Recent Activity</h2>

            {userStats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {userStats.recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                      activity.type === 'quiz' ? 'bg-green-100' :
                      activity.type === 'video' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 group-hover:text-teal-600 transition">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No recent activity yet</p>
                <p className="text-gray-400 text-xs mt-1">Start learning to see your progress here!</p>
              </div>
            )}

            <button 
              onClick={handleContinueLearning}
              className="w-full mt-6 bg-teal-50 text-teal-700 py-3 rounded-lg hover:bg-teal-100 transition font-medium"
            >
              View All Activity →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;