'use client';
import Link from 'next/link'
import { motion } from 'motion/react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center space-y-8 max-w-lg">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-9xl font-black text-slate-900 tracking-tighter font-outfit"
        >
          404
        </motion.h1>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Transmission Lost</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            The sequence you are looking for has been purged from the collective records or never existed in this dimension.
          </p>
        </div>
        <div className="pt-8">
          <Link 
            href="/" 
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-xl inline-block"
          >
            Return to Archive
          </Link>
        </div>
      </div>
    </div>
  )
}
