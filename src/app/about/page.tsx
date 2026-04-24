'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="text-indigo-600" size={24} />,
      title: "Data Integrity",
      description: "We prioritize the security and authenticity of every transmission node in our collective."
    },
    {
      icon: <Zap className="text-indigo-600" size={24} />,
      title: "High Performance",
      description: "Our platform is architected for speed, ensuring seamless access to global intelligence."
    },
    {
      icon: <Globe className="text-indigo-600" size={24} />,
      title: "Digital Philosophy",
      description: "We explore the profound impact of technology on human consciousness and design."
    },
    {
      icon: <Users className="text-indigo-600" size={24} />,
      title: "Collective Mind",
      description: "Lumina is more than a blog; it's a hub for shared observations and collaborative growth."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      {/* Hero Section */}
      <header className="mb-32 relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            Identity & Vision
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter font-outfit">
            THE ARCHITECTURE <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-400 font-outfit">OF INSIGHT.</span>
          </h1>
          
          <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed">
            Lumina is a decentralized archive for the modern curator, bridging the gap between raw data and digital wisdom.
          </p>
        </motion.div>
      </header>

      {/* Philosophy Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-40 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-100"
        >
          <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" 
            alt="Digital Hardware" 
            className="w-full h-full object-cover grayscale opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-indigo-600/10 mix-blend-overlay"></div>
        </motion.div>

        <div className="space-y-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit uppercase">Our Protocol</h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-medium">
            <p>
              We believe that in an era of information overload, clarity is the ultimate luxury. Lumina was founded on the principle of curated intelligence—where every post serves as a node in a larger network of industrial design and digital philosophy.
            </p>
            <p>
              Our mission is to provide a breathable, high-fidelity space for thinkers, architects, and creators to share observations that transcend the noise of contemporary social streams.
            </p>
          </div>
          <div className="pt-4">
             <Link href="/login" className="inline-flex items-center gap-3 text-indigo-600 font-black uppercase tracking-widest text-sm hover:gap-5 transition-all">
                Establish your ID <ArrowRight size={18} />
             </Link>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="space-y-20">
        <header className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit uppercase">Core Directives</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">The foundations of the Lumina Network.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-indigo-100 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight font-outfit uppercase mb-4">{v.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-40">
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-indigo-600/20 to-transparent"></div>
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter font-outfit uppercase leading-none">
              READY TO <br /> <span className="text-indigo-400 font-outfit">CONTRIBUTE?</span>
            </h2>
            <p className="text-indigo-100/60 max-w-xl mx-auto text-lg font-medium">
              Join the collective intelligence and start recording your observations today. Minimal noise, maximum impact.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <Link href="/login" className="px-12 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl">
                Initialize Access
              </Link>
              <Link href="/" className="px-12 py-4 bg-transparent text-white border border-white/20 rounded-2xl font-bold hover:bg-white/5 transition-all active:scale-95">
                Explore Archive
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
