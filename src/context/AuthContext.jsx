// // import { createContext, useContext, useState, useEffect } from "react";
// // import { useToast } from "./ToastContext";
// // import { useNavigate } from "react-router-dom";
// // const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const { showSuccess, showError } = useToast();

// //   useEffect(() => {
// //     // Check for saved session on mount
// //     const savedUser = localStorage.getItem("user");
// //     if (savedUser) {
// //       try {
// //         const userData = JSON.parse(savedUser);
// //         setUser(userData);
// //         setIsAuthenticated(true);
// //       } catch (error) {
// //         console.error("Failed to parse user data:", error);
// //       }
// //     }
// //     setLoading(false);
// //   }, []);

// //   const login = async (email, password) => {
// //     try {
// //       // Static validation - Replace with API call later
// //       if (email === "admin@jobportal.com" && password === "password123") {
// //         const userData = {
// //           id: 1,
// //           name: "Admin User",
// //           email: "admin@jobportal.com",
// //           role: "Super Admin",
// //           avatar: "AD",
// //           department: "HR",
// //           joinDate: "2024-01-15",
// //           phone: "+91 98765 43210",
// //           location: "Ahmedabad, India",
// //           bio: "Experienced HR professional with 8+ years in recruitment and talent management.",
// //           permissions: [
// //             "manage_users",
// //             "manage_jobs",
// //             "manage_candidates",
// //             "view_reports",
// //           ],
// //         };
// //         setUser(userData);
// //         setIsAuthenticated(true);
// //         localStorage.setItem("user", JSON.stringify(userData));
// //         showSuccess("Login successful! Welcome back.");
// //         return { success: true };
// //       } else {
// //         showError("Invalid email or password");
// //         return { success: false, error: "Invalid credentials" };
// //       }
// //     } catch (error) {
// //       showError("Login failed. Please try again.");
// //       return { success: false, error: error.message };
// //     }
// //   };

// //   const logout = () => {
// //     setUser(null);
// //     setIsAuthenticated(false);
// //     localStorage.removeItem("user");
// //     showSuccess("Logged out successfully");
// //   };

// //   const updateUser = (updatedData) => {
// //     const newUserData = { ...user, ...updatedData };
// //     setUser(newUserData);
// //     localStorage.setItem("user", JSON.stringify(newUserData));
// //     showSuccess("Profile updated successfully!");
// //   };

// //   const forgotPassword = async (email) => {
// //     try {
// //       // Static validation - Replace with API call later
// //       if (email === "admin@jobportal.com") {
// //         showSuccess("Password reset link sent to your email!");
// //         return { success: true };
// //       } else {
// //         showError("Email not found");
// //         return { success: false, error: "Email not found" };
// //       }
// //     } catch (error) {
// //       showError("Failed to send reset link. Please try again.");
// //       return { success: false, error: error.message };
// //     }
// //   };

// //   const value = {
// //     user,
// //     isAuthenticated,
// //     loading,
// //     login,
// //     logout,
// //     updateUser,
// //     forgotPassword,
// //   };

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // }

// // export function useAuth() {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error("useAuth must be used within an AuthProvider");
// //   }
// //   return context;
// // }

// // // Protected Route Component
// // export function ProtectedRoute({ children }) {
// //   const { isAuthenticated, loading } = useAuth();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (!loading && !isAuthenticated) {
// //       navigate("/login");
// //     }
// //   }, [isAuthenticated, loading, navigate]);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-3">
// //           <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
// //           <p className="text-sm text-gray-400">Loading...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return isAuthenticated ? children : null;
// // }

// import { createContext, useContext, useState, useEffect } from "react";
// import { useToast } from "./ToastContext";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(null);
//   const { showSuccess, showError } = useToast();

//   // On mount, restore session from localStorage
//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     const savedUser = localStorage.getItem("user");
//     if (savedToken && savedUser) {
//       try {
//         const userData = JSON.parse(savedUser);
//         setUser(userData);
//         setToken(savedToken);
//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error("Failed to parse user data:", error);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       }
//     }
//     setLoading(false);
//   }, []);

//   // ---------- LOGIN ----------
//   const login = async (email, password) => {
//     try {
//       const response = await fetch(
//         "https://hire-me-jobs.onrender.com/company-users/login",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         }
//       );

//       const data = await response.json();
//       console.log("Login API response:", data);

//       if (!response.ok) {
//         // The server may send a message in data.message or data.error
//         const errorMsg = data.message || data.error || "Invalid credentials";
//         throw new Error(errorMsg);
//       }

//       // Our API wraps token and user inside a `data` object
//       const { token: authToken, user: userData } = data.data || {};

//       if (!authToken || !userData) {
//         throw new Error("Incomplete response from server");
//       }

//       // Save to state & localStorage
//       setToken(authToken);
//       setUser(userData);
//       setIsAuthenticated(true);
//       localStorage.setItem("token", authToken);
//       localStorage.setItem("user", JSON.stringify(userData));

//       showSuccess(data.message || "Login successful! Welcome back.");
//       return { success: true };
//     } catch (error) {
//       console.error("Login error:", error);
//       showError(error.message || "Login failed. Please try again.");
//       return { success: false, error: error.message };
//     }
//   };

//   // ---------- REGISTER (SIGN UP) ----------
//   const register = async (email, password, mobile) => {
//     try {
//       const payload = {
//         email,
//         password,
//         mobile,
//         login_type: "email",
//       };

//       const response = await fetch(
//         "https://hire-me-jobs.onrender.com/company-users/",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();
//       console.log("Registration API response:", data);

//       if (!response.ok) {
//         const errorMsg = data.message || data.error || "Registration failed";
//         throw new Error(errorMsg);
//       }

//       // If registration returns a similar structure, we could auto-login,
//       // but we'll just show success and let user switch to login.
//       showSuccess(data.message || "Account created! You can now log in.");
//       return { success: true, user: data.data?.user || data };
//     } catch (error) {
//       console.error("Registration error:", error);
//       showError(error.message || "Registration failed. Please try again.");
//       return { success: false, error: error.message };
//     }
//   };

//   // ---------- LOGOUT ----------
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     showSuccess("Logged out successfully");
//   };

//   // ---------- UPDATE USER ----------
//   const updateUser = (updatedData) => {
//     const newUserData = { ...user, ...updatedData };
//     setUser(newUserData);
//     localStorage.setItem("user", JSON.stringify(newUserData));
//     showSuccess("Profile updated successfully!");
//   };

//   // ---------- FORGOT PASSWORD (placeholder) ----------
//   const forgotPassword = async (email) => {
//     try {
//       if (email) {
//         showSuccess("Password reset link sent to your email!");
//         return { success: true };
//       } else {
//         showError("Please enter your email");
//         return { success: false, error: "Email required" };
//       }
//     } catch (error) {
//       showError("Failed to send reset link. Please try again.");
//       return { success: false, error: error.message };
//     }
//   };

//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     token,
//     login,
//     register,
//     logout,
//     updateUser,
//     forgotPassword,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

// // ---------- PROTECTED ROUTE ----------
// export function ProtectedRoute({ children }) {
//   const { isAuthenticated, loading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       navigate("/login");
//     }
//   }, [isAuthenticated, loading, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return isAuthenticated ? children : null;
// }

import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const { showSuccess, showError } = useToast();

  // On mount, restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setToken(savedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ---------- LOGIN ----------
  const login = async (email, password) => {
    try {
      const response = await fetch(buildApiUrl("/company-users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login API response:", data);

      if (!response.ok) {
        // The server may send a message in data.message or data.error
        const errorMsg = data.message || data.error || "Invalid credentials";
        throw new Error(errorMsg);
      }

      // Our API wraps token and user inside a `data` object
      const { token: authToken, user: userData } = data.data || {};

      if (!authToken || !userData) {
        throw new Error("Incomplete response from server");
      }

      // Save to state & localStorage
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      showSuccess(data.message || "Login successful! Welcome back.");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      showError(error.message || "Login failed. Please try again.");
      return { success: false, error: error.message };
    }
  };

  // ---------- REGISTER (SIGN UP) ----------
  const register = async (email, password, mobile) => {
    try {
      const payload = {
        email,
        password,
        mobile,
        login_type: "email",
      };

      const response = await fetch(buildApiUrl("/company-users/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Registration API response:", data);

      if (!response.ok) {
        const errorMsg = data.message || data.error || "Registration failed";
        throw new Error(errorMsg);
      }

      // If registration returns a similar structure, we could auto-login,
      // but we'll just show success and let user switch to login.
      showSuccess(data.message || "Account created! You can now log in.");
      return { success: true, user: data.data?.user || data };
    } catch (error) {
      console.error("Registration error:", error);
      showError(error.message || "Registration failed. Please try again.");
      return { success: false, error: error.message };
    }
  };

  // ---------- LOGOUT ----------
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showSuccess("Logged out successfully");
  };

  // ---------- UPDATE USER ----------
  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
    showSuccess("Profile updated successfully!");
  };

  // ---------- FORGOT PASSWORD (placeholder) ----------
  const forgotPassword = async (email) => {
    try {
      if (email) {
        showSuccess("Password reset link sent to your email!");
        return { success: true };
      } else {
        showError("Please enter your email");
        return { success: false, error: "Email required" };
      }
    } catch (error) {
      showError("Failed to send reset link. Please try again.");
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    token,
    login,
    register,
    logout,
    updateUser,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ---------- PROTECTED ROUTE ----------
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}
