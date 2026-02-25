"use client";

import { useContext, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserContext } from "../../_context/User";
import Link from "next/link";
import WealthconLogo from "@/components/Logo/WealthconLogo";

export default function LoginForm() {
  const { setUserDetails, setLiveSessions, setNotes, setGallery, setMessages } =
    useContext(UserContext);
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setUserDetails(null);
    setLiveSessions([]);
    setNotes([]);
    setGallery([]);
    setMessages([]);
  }, [setUserDetails, setLiveSessions, setNotes, setGallery, setMessages]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate form
    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const data = response?.data;
      if (response.status === 200) {
        const redirectPath =
          data?.role === "admin" || data?.role === "superAdmin"
            ? "/admin"
            : "/home";
        router.push(redirectPath);
      } else {
        setError(data?.error ?? "Login failed");
        setLoading(false);
      }
    } catch (error) {
      if (error?.response?.status === 500) {
        setError("An error occurred. Please try again.");
      } else {
        setError(error?.response?.data?.error || "Something went wrong");
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-[#050a14]">
      {/* Background Video with Ken Burns effect */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        poster="https://images.unsplash.com/photo-1554224154-260325c25b67?auto=format&fit=crop&w=1920&q=80"
        style={{ animation: 'kenburns 15s ease-out infinite alternate' }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-computer-data-processing-34224-large.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Branding */}
        <div
          className="text-white text-center lg:text-left"
          style={{ animation: 'animateEnterLeft 0.6s ease-out 0.2s both' }}
        >
          <div className="inline-block lg:block">
            <WealthconLogo size={160} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-4 uppercase">
            WEALTHCON
          </h1>
          <p className="text-xl md:text-2xl font-light mt-2 text-cyan-300">
            Financial Education Platform
          </p>
          <p className="text-lg text-white/80 mt-1">
            For Doctors, By Doctors.
          </p>
        </div>

        {/* Right: Login Form */}
        <div
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl"
          style={{ animation: 'animateEnterRight 0.6s ease-out 0.4s both' }}
        >
          <form onSubmit={handleLogin}>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back 👋</h2>
            <p className="text-white/60 mb-8">Sign in to access your dashboard.</p>

            <div className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/20 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 peer transition-colors"
                  placeholder="Email"
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 -top-2.5 text-sm text-white/70 bg-[#050a14] px-1 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400 transition-all"
                >
                  Email
                </label>
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/20 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 peer transition-colors"
                  placeholder="Password"
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 -top-2.5 text-sm text-white/70 bg-[#050a14] px-1 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400 transition-all"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 hover:text-white/80"
                  aria-label="Toggle password visibility"
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Link href="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-100 disabled:bg-cyan-800 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : 'Login'}
            </button>

            <p className="text-center text-xs text-white/40 mt-8">
              By signing in, you agree to our <Link href="#" className="underline hover:text-white/60">Terms of Service</Link> and <Link href="#" className="underline hover:text-white/60">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        @keyframes animateEnterLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes animateEnterRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
