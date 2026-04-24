'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { User, Camera, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

import Image from 'next/image';

export default function SettingsPage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ bio: '', avatar: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (user) {
      setFormData({ 
        bio: (user as any).bio || '', 
        avatar: (user as any).avatar || '' 
      });
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        await updateUser();
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading) return (
    <div className="max-w-4xl mx-auto py-32 px-6 flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing ID...</p>
    </div>
  );

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-32">
      <div className="mb-12">
        <Link 
          href={`/profile/${user.username}`} 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} />
          Return to Registry
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-indigo-100/50 border border-indigo-50"
      >
        <header className="mb-16">
          <div className="w-12 h-1.5 bg-indigo-600 rounded-full mb-6"></div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter font-outfit uppercase">
            Configure <br /> Identity
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-4">Update your public representation in the collective.</p>
        </header>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-12 py-4 px-6 rounded-2xl text-xs font-bold border flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-600 border-green-100' 
                : 'bg-red-50 text-red-500 border-red-100'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${message.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}></div>
            {message.type === 'success' ? 'SUCCESS:' : 'ERROR:'} {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4 flex items-center gap-2">
              <Camera size={14} /> Avatar URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300"
                placeholder="https://images.unsplash.com/..."
              />
              {formData.avatar && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm bg-white">
                  <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4 flex items-center gap-2">
              <User size={14} /> Biography
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-4xl p-8 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-50 transition-all min-h-45 resize-none placeholder:text-slate-300"
              placeholder="Tell the collective about your purpose..."
            />
          </div>

          <button 
            type="submit" 
            disabled={isUpdating}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
          >
            {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Commit Updates
          </button>
        </form>
      </motion.div>
    </div>
  );
}
