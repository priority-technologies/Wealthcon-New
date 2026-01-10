import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// A new SVG logo component for Wealthcon
const WealthconLogo = () => (
  <svg width="100" height="100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id="text-arc" d="M 50 115 A 60 60 0 0 1 150 115"></path>
      <path id="leaf" d="M 0 0 C 5 -10, 15 -10, 20 0 C 15 10, 5 10, 0 0 Z" fill="#00AEEF"></path>
    </defs>
    
    <g transform="translate(100, 100)">
        {[...Array(15)].map((_, i) => (
            <use key={`L${i}`} href="#leaf" transform={`rotate(${-85 - i * 11.3}) translate(88, 0) scale(0.8) rotate(55)`} />
        ))}
        {[...Array(15)].map((_, i) => (
            <use key={`R${i}`} href="#leaf" transform={`rotate(${85 + i * 11.3}) translate(88, 0) scale(0.8) rotate(-55)`} />
        ))}
    </g>

    <g transform="translate(0, -10)">
      <path d="M100 160 L40 70 L65 70 L100 120 L135 70 L160 70 Z" fill="#00AEEF" />
      <path d="M65 70 L100 120 L100 100 L75 70 Z" fill="rgba(0,0,0,0.2)" />
      <path d="M135 70 L100 120 L100 100 L125 70 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M100 130 L94 145 H 106 Z" fill="#00AEEF" />
      <rect x="92" y="145" width="16" height="4" rx="2" fill="#00AEEF" />
      <path d="M100 125 L98 120 H 102 Z" fill="#050a14" />
      <path d="M100 130 L100 125 L98 120 L100 130 Z" fill="rgba(0,0,0,0.2)" />
      <path d="M100 130 L100 125 L102 120 L100 130 Z" fill="rgba(255,255,255,0.2)" />
    </g>

    <text fill="#00AEEF" fontSize="22" fontWeight="bold" letterSpacing="4.5">
      <textPath href="#text-arc" startOffset="50%" textAnchor="middle">WEALTHCON</textPath>
    </text>
  </svg>
);

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would check credentials here.
      // For this demo, we'll just simulate a successful login.
      onLoginSuccess();
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden animated-overlay">
      {/* Background Video with Ken Burns effect on poster */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        poster="https://images.unsplash.com/photo-1554224154-260325c25b67?auto=format&fit=crop&w=1920&q=80"
        style={{ animation: 'kenburns 15s ease-out infinite alternate' }}
      >
        {/* Using a stock video related to financial technology and data processing */}
        <source src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-computer-data-processing-34224-large.mp4" type="video/mp4" />
      </video>
      
      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Branding */}
        <div 
          className="text-white text-center lg:text-left animate-enter-left"
          style={{ animationDelay: '200ms', opacity: 0 }}
        >
          <div className="inline-block lg:block">
             <WealthconLogo />
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
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl animate-enter-right"
          style={{ animationDelay: '400ms', opacity: 0 }}
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
                  defaultValue="doctor@wealthcon.com"
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
                  defaultValue="password123"
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
              <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline">
                Forgot password?
              </a>
            </div>

            {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-100 disabled:bg-cyan-800 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : 'Login'}
            </button>

            <p className="text-center text-xs text-white/40 mt-8">
              By signing in, you agree to our <a href="#" className="underline hover:text-white/60">Terms of Service</a> and <a href="#" className="underline hover:text-white/60">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;