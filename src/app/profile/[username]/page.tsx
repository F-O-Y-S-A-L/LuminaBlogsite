'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { User as UserIcon, FileText as PostIcon, Calendar, Mail, MapPin, Link as LinkIcon, Loader2, User } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      try {
        const res = await fetch(`/api/users/${username}`);
        const data = await res.json();
        
        if (res.ok) {
          setProfileData(data);
        } else {
          setError(data.error || 'Identity sequence missing');
        }
      } catch (err) {
        setError('Connection to registry failed');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);
  console.log(profileData)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-32 px-6 flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Profile...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-6 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit uppercase mb-4">Identity Not Found</h1>
        <p className="text-slate-400 text-sm font-medium mb-12">{error || 'The requested transmission could not be located in our records.'}</p>
        <Link 
          href="/" 
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

  const { user, posts } = profileData;

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 pb-40">
      {/* Header Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-32"
      >
        <header className="flex flex-col md:flex-row gap-16 items-start">
          <div className="relative group">
            <div className="w-48 h-48 rounded-[3.5rem] bg-indigo-50 border-4 border-white shadow-2xl shadow-indigo-100/50 overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={64} className="text-indigo-200" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
               <UserIcon size={20} />
            </div>
          </div>

          <div className="flex-1 space-y-8 pt-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                Verified Identity
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter font-outfit uppercase leading-[0.85]">
                {user.username}
              </h1>
            </div>
            
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
              {user.bio || "This entity has not yet established a public biography. Their recorded sequences currently serve as their primary representation."}
            </p>

            <div className="flex flex-wrap gap-12 pt-8 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1">Registration Date</span>
                <span className="text-sm font-bold text-slate-900">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1">Recorded Sequences</span>
                <span className="text-sm font-bold text-slate-900">{posts.length} TRANSMISSIONS</span>
              </div>
            </div>
          </div>
        </header>
      </motion.div>

      {/* User's Entries Section */}
      <div className="space-y-16">
        <header className="flex items-center justify-between border-b border-slate-100 pb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter font-outfit uppercase">
            Captured Archives
          </h2>
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Filtering: ALL NODES</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.length > 0 ? (
            posts.map((post: any, index: number) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/post/${post.slug}`} className="block space-y-6">
                  <div className="relative aspect-4/5 rounded-[3rem] overflow-hidden bg-slate-50 shadow-2xl shadow-slate-200/50">
                    {post.coverImage ? (
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PostIcon size={48} className="text-slate-200" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                       <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest border border-white/50">
                          {post.category}
                       </span>
                    </div>
                  </div>
                  
                  <div className="px-4 space-y-3">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter font-outfit group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight uppercase">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">
                          RECORDED: {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                       </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full py-32 bg-white rounded-[4rem] border border-dashed border-slate-200 text-center">
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Registry Silent // No sequences recorded by this identity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
