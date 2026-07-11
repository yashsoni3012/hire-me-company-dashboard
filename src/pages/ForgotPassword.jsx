import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TbMail,
  TbArrowLeft,
  TbBriefcase,
  TbLock,
  TbEye,
  TbEyeOff,
  TbShieldLock,
  TbCircleCheck,
} from "react-icons/tb";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();

  // ---------- Step control: "email" -> "otp" -> "success" ----------
  const [step, setStep] = useState("email");

  // ---------- Step 1: Email ----------
  const [email, setEmail] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [emailError, setEmailError] = useState("");

  // ---------- Step 2: OTP + New Password ----------
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState("");

  // Resend OTP
  const [isResending, setIsResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  // ---------- Step 1 submit: request OTP ----------
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    setIsSendingOtp(true);
    try {
      const result = await forgotPassword(email);
      if (result?.success) {
        setStep("otp");
      } else {
        setEmailError(result?.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ---------- Resend OTP ----------
  const handleResendOtp = async () => {
    setResendMsg("");
    setIsResending(true);
    try {
      const result = await forgotPassword(email);
      if (result?.success) {
        setResendMsg("OTP resent to your email.");
      } else {
        setResendMsg(result?.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("❌ Resend OTP error:", err);
      setResendMsg("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
      setTimeout(() => setResendMsg(""), 4000);
    }
  };

  // ---------- Step 2 submit: verify OTP + set new password ----------
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");

    if (!otp) {
      setResetError("OTP is required");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setResetError("Please enter and confirm your new password");
      return;
    }
    if (newPassword.length < 6) {
      setResetError("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("New password and confirm password do not match");
      return;
    }

    try {
      setIsResetting(true);

      const res = await fetch(
        "https://hire-me-jobs.onrender.com/company-users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        },
      );

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || "Failed to reset password.",
        );
      }

      setStep("success");
    } catch (err) {
      console.error("❌ Reset password error:", err);
      setResetError(
        err.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsResetting(false);
    }
  };

  const Logo = () => (
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
  );

  // ---------- SUCCESS SCREEN ----------
  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Logo />
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800 text-center">
            <div className="w-20 h-20 bg-success-50 dark:bg-success-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TbCircleCheck size={40} className="text-success-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Password Reset!
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Your password has been changed successfully. <br />
              You can now sign in with your new password.
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

  // ---------- OTP + NEW PASSWORD SCREEN ----------
  if (step === "otp") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Logo />

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Enter OTP &amp; New Password
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                We've sent a 6-digit OTP to{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {email}
                </span>
                . Enter it below along with your new password.
              </p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-5">
              {resetError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-danger-500">
                  {resetError}
                </div>
              )}

              {/* OTP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  OTP
                </label>
                <div className="relative">
                  <TbShieldLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      setResetError("");
                    }}
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none tracking-widest"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <TbLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setResetError("");
                    }}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showNewPass ? <TbEyeOff size={18} /> : <TbEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <TbLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setResetError("");
                    }}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPass ? (
                      <TbEyeOff size={18} />
                    ) : (
                      <TbEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isResetting}
                className="w-full py-3 px-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isResetting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              {/* Resend OTP */}
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors disabled:opacity-60"
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
               
              </div>

              {resendMsg && (
                <p className="text-xs text-center text-gray-400">
                  {resendMsg}
                </p>
              )}

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

  // ---------- EMAIL SCREEN (Step 1) ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Logo />

        {/* Forgot Password Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Reset Password
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Enter your email address and we'll send you an OTP to reset your
              password.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-5">
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
                    setEmailError("");
                  }}
                  placeholder="admin@jobportal.com"
                  className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
                    emailError
                      ? "border-danger-500 focus:ring-danger-500/20"
                      : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-xs text-danger-500">{emailError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full py-3 px-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSendingOtp ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "Send OTP"
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