import { useState } from "react";
import { Link } from "react-router-dom";
import { TbMail, TbArrowLeft, TbBriefcase } from "react-icons/tb";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setError("");
    const result = await forgotPassword(email);
    setIsLoading(false);

    if (result.success) {
      setIsSent(true);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                <TbBriefcase size={22} />
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                JOB<span className="text-brand-500">PORTAL</span>
              </span>
            </div>
          </div>

          {/* Success Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800 text-center">
            <div className="w-20 h-20 bg-success-50 dark:bg-success-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Check Your Email
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              We've sent a password reset link to <br />
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {email}
              </span>
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
            >
              <TbArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white">
              <TbBriefcase size={22} />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              JOB<span className="text-brand-500">PORTAL</span>
            </span>
          </div>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Reset Password
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <TbMail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="admin@jobportal.com"
                  className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
                    error
                      ? "border-danger-500 focus:ring-danger-500/20"
                      : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  }`}
                />
              </div>
              {error && (
                <p className="mt-1.5 text-xs text-danger-500">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <TbArrowLeft size={16} />
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
