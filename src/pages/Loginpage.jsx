import { useState } from "react";

function Loginpage (){
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-8">
          Welcome Back!
        </h2>

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                👁️
              </span>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              Remember me
            </label>

            <span className="text-teal-700 cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-teal-700 text-white p-3 rounded-xl hover:bg-teal-800 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <span className="text-teal-700 font-medium cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Loginpage;
