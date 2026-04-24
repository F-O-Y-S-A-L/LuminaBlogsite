'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center space-y-8 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto"
        >
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">System Breach</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            An unexpected error occurred while syncing with the collective. The current protocol has been interrupted.
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
        >
          Re-initialize Sequence
        </button>
      </div>
    </div>
  )
}
