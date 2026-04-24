'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Settings, ChevronDown, Database, Plus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import Image from 'next/image';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 rounded-3xl h-16 px-6 flex items-center justify-between transition-all duration-300">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform duration-300">L</div>
            <span className="text-xl font-outfit font-black tracking-tighter text-slate-900">LUMINA.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">All</Link>
            <Link href="/?category=Tech" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Tech</Link>
            <Link href="/?category=Life" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Life</Link>
            <Link href="/?category=Design" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Design</Link>
          </div>

          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <Link 
                href="/admin" 
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Plus size={14} /> New Transmission
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3 relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 p-1 hover:bg-slate-100/50 rounded-2xl transition-colors border border-transparent hover:border-slate-200/50"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center text-white text-[10px] font-black uppercase relative">
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.username} fill className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      user.username.substring(0, 2)
                    )}
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/60 p-2 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 mb-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Authenticated</div>
                        <div className="text-sm font-bold text-slate-900 truncate">{user.username}</div>
                      </div>
                      
                      <Link 
                        href={`/profile/${user.username}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 w-full p-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all"
                      >
                        <UserIcon size={18} /> Profile
                      </Link>
                      
                      <Link 
                        href="/settings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 w-full p-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all"
                      >
                        <Settings size={18} /> Settings
                      </Link>

                      {user.role === 'admin' && (
                        <Link 
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 w-full p-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all"
                        >
                          <Database size={18} /> Admin Station
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-2xl transition-all mt-1"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-slate-900 text-white px-6 py-2 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
