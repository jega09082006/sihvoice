import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Phone, UploadCloud, BarChart3, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Upload & Analyze', path: '/', icon: UploadCloud },
    { name: 'Deep Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* Top Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1a73e8] via-[#f59e0b] to-[#1a73e8]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a73e8]/30 via-black to-[#f59e0b]/20 border border-[#1a73e8]/50 flex items-center justify-center shadow-[0_0_20px_rgba(26,115,232,0.3)] group-hover:border-[#1a73e8] transition-all duration-300">
            <Phone className="w-5 h-5 text-[#1a73e8]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-black tracking-wide text-white group-hover:text-[#1a73e8] transition-colors leading-tight">
                Voice <span className="text-[#1a73e8]">Recognizer</span> and Management
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
              AI-Powered Call Analysis &amp; Quality Platform · Upload. Analyze. Understand.
            </span>
          </div>
        </Link>

        {/* Desktop Nav — 2 tabs only */}
        <nav className="hidden md:flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1a73e8]/25 to-[#1a73e8]/10 text-[#1a73e8] border border-[#1a73e8]/60 shadow-[0_0_15px_rgba(26,115,232,0.35)] scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Live Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-[#22c55e]/30 text-[11px] font-mono font-bold text-gray-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
            </span>
            <span className="text-[#22c55e]">DEV BUILD</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-300"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#f59e0b]" />
            ) : (
              <Moon className="w-4 h-4 text-[#1a73e8]" />
            )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-[#f59e0b]" /> : <Moon className="w-5 h-5 text-[#1a73e8]" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0f]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#1a73e8]/20 border border-[#1a73e8]/50 text-[#1a73e8]'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
