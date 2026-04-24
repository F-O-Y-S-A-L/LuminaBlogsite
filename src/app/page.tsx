'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Post } from '@/types';
import PostCard from '@/components/PostCard';
import { motion } from 'motion/react';
import Link from 'next/link';

function HomeContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (category) query.set('category', category);
        
        const res = await fetch(`/api/posts?${query.toString()}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <header className="mb-32 relative">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
            Now Live: Version 2.0
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter font-outfit">
            INSIGHTS <br /> 
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-400">UNBOUNDED.</span>
          </h1>
          
          <p className="max-w-xl text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            Exploring the intersection of modern technology, industrial design, and digital philosophy.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/?category=Tech" className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
              Explore Tech
            </Link>
            <Link href="/about" className="px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95">
              About
            </Link>
          </div>
        </motion.div>
      </header>

      <div className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-8">
          <nav className="flex flex-wrap items-center gap-2">
            <Link 
              href="/" 
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${!category ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
            >
              All Post
            </Link>
            {['Tech', 'Design', 'Life'].map(cat => (
              <Link 
                key={cat} 
                href={`/?category=${cat}`} 
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${category === cat ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
              >
                {cat}
              </Link>
            ))}
          </nav>
          
          <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            {posts.length} Sequences Found
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 6].map(i => (
              <div key={i} className="space-y-6">
                <div className="aspect-4/3 bg-slate-100 rounded-3xl animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-6 w-3/4 bg-slate-100 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-slate-100 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-16">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Registry is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading sequence...</div>}>
      <HomeContent />
    </Suspense>
  );
}
