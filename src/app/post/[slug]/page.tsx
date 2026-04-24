'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Post, Comment } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { MessageSquare, Share2, Heart } from 'lucide-react';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<(Post & { comments: Comment[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } catch (err) {
        console.error('Error fetching post');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPost();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, content: commentText })
      });

      if (res.ok) {
        setCommentText('');
        // Re-fetch post to get new comment
        const updatedRes = await fetch(`/api/posts/${slug}`);
        const updatedData = await updatedRes.json();
        setPost(updatedData);
      }
    } catch (err) {
      console.error('Error posting comment');
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto py-32 px-6 flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Content...</p>
    </div>
  );

  if (!post) return (
    <div className="max-w-4xl mx-auto py-32 px-6 text-center">
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">404 // Post Not Found</h2>
      <p className="text-slate-400 text-sm font-medium mb-8">The requested transmission could not be located in our records.</p>
      <Link href="/" className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all">
        Return to Archive
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-32">
      <header className="mb-20 space-y-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-600"
        >
          <Link href="/" className="hover:text-slate-900 transition-colors">Archive</Link>
          <span className="w-1 h-1 rounded-full bg-indigo-200"></span>
          <span>{post.category}</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] font-outfit"
        >
          {post.title}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-8 pt-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {post.authorName[0]}
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Architect</div>
              <Link href={`/profile/${post.authorName}`} className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                {post.authorName}
              </Link>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-100"></div>
          <div className="text-left">
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Released</div>
            <div className="text-sm font-bold text-slate-900">
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </motion.div>
      </header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative aspect-21/9 bg-slate-100 rounded-[3rem] overflow-hidden mb-24 shadow-2xl shadow-indigo-100/50"
      >
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </motion.div>

      <article className="max-w-2xl mx-auto mb-32">
        <div className="text-slate-700 leading-[1.8] text-lg space-y-10 font-medium whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      <section className="max-w-2xl mx-auto space-y-16 pt-20 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <header>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter font-outfit uppercase">Discussion</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.comments.length} Registered Nodes</p>
          </header>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
              <Share2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-pink-500 transition-colors">
              <Heart size={18} />
            </button>
          </div>
        </div>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="space-y-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Contribution to the collective intelligence..."
              className="w-full bg-white border border-slate-200 rounded-4xl p-8 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-50 transition-all min-h-40 shadow-sm"
            />
            <button className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
              Push Response
            </button>
          </form>
        ) : (
          <div className="p-16 bg-slate-50 border border-indigo-50 rounded-[3rem] text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Access token required for interaction.</p>
            <Link href="/login" className="px-10 py-4 bg-white text-indigo-600 border border-indigo-100 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-md">
              Initialize Portal
            </Link>
          </div>
        )}

        <div className="space-y-10">
          {post.comments.length > 0 ? post.comments.map((comment, index) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={comment.id}
              className="flex gap-6 items-start"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 shrink-0 flex items-center justify-center text-slate-400 font-bold text-xs">
                {comment.authorName[0]}
              </div>
              <div className="space-y-2 grow">
                <div className="flex items-center justify-between">
                  <Link href={`/profile/${comment.authorName}`} className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                    {comment.authorName}
                  </Link>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-4xl text-slate-600 text-[15px] leading-relaxed">
                  {comment.content}
                </div>
              </div>
            </motion.div>
          )) : (
            <p className="text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest py-10 border border-dashed border-slate-100 rounded-4xl">No discussion nodes registered yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
