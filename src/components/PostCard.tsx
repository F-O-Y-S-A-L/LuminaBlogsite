'use client';

import Link from 'next/link';
import { Post } from '../types';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

import Image from 'next/image';

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <Link href={`/post/${post.id}`} className="block space-y-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-2xl shadow-slate-200/50">
          <Image
            src={post.coverImage || 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80&w=1200'}
            alt={post.title}
            fill
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-6 left-6">
            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest border border-white/50">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="px-2 space-y-4">
          <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter font-outfit transition-colors group-hover:text-indigo-600">
            {post.title}
          </h3>
          
          <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed opacity-80">
            {post.excerpt}
          </p>

          <div className="pt-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                {post.authorName[0]}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.authorName}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
