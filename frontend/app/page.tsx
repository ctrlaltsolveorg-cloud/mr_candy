'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Package, Truck, Settings, Sparkles, Utensils, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const cards = [
    { title: 'Order Samaan', desc: 'Fresh & Tasty Items', icon: Utensils, path: '/shop', color: 'bg-[#f43f5e]', light: 'bg-rose-50', gradient: 'from-[#F43F5E] to-[#FB923C]', accent: 'text-rose-500', bg: 'bg-rose-50' },
    { title: 'Stock Check', desc: 'Manage Inventory', icon: Package, path: '/mother', color: 'bg-[#fbbf24]', light: 'bg-amber-50', gradient: 'from-[#FBBF24] to-[#F59E0B]', accent: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Delivery', desc: 'Speedy Delivery', icon: Truck, path: '/delivery', color: 'bg-[#10b981]', light: 'bg-emerald-50', gradient: 'from-[#10B981] to-[#059669]', accent: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Admin', desc: 'Settings & More', icon: Settings, path: '/admin', color: 'bg-[#6366f1]', light: 'bg-indigo-50', gradient: 'from-[#6366F1] to-[#4F46E5]', accent: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col items-center justify-center p-6 sm:p-16 overflow-hidden relative selection:bg-rose-100">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-rose-100/40 rounded-full blur-[160px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-orange-100/40 rounded-full blur-[160px] animate-pulse pointer-events-none" />
      
      {/* Decorative Floating Icon */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[15%] opacity-20 hidden lg:block"
      >
        <Star size={80} className="text-orange-400 fill-orange-400" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20 relative z-10"
      >
        <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-white px-6 py-2.5 rounded-full text-xs font-black tracking-[0.2em] uppercase text-rose-500 border-2 border-rose-50 shadow-xl shadow-rose-100/20 mb-8 cursor-default"
        >
          <Sparkles size={16} className="animate-spin-slow" /> Luxury Mart System
        </motion.div>
        
        <h1 className="text-8xl sm:text-9xl font-black text-[#1C1917] mb-6 tracking-[-0.04em] leading-[0.85] flex flex-col items-center">
          <span className="relative">
            MR.
            <motion.div 
                initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-2 left-0 h-4 bg-rose-500/10 -rotate-1" 
            />
          </span>
          <span className="bg-gradient-to-r from-[#F43F5E] via-[#FB923C] to-[#F43F5E] bg-clip-text text-transparent animate-gradient-x py-2">
            CANDY
          </span>
        </h1>
        
        <p className="text-[#78716C] text-xl sm:text-2xl font-bold max-w-2xl mx-auto leading-relaxed mt-4">
            Elevating your <span className="text-[#1C1917] underline decoration-rose-200 decoration-4 underline-offset-4">grocery management</span> experience with world-class aesthetics.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">
        {cards.map((card, idx) => (
          <motion.button 
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 80 }}
            whileHover={{ scale: 1.03, y: -10 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(card.path)}
            className="group bg-white p-10 rounded-[56px] shadow-[0_30px_70px_-20px_rgba(28,25,23,0.1)] border-4 border-white hover:border-orange-50 flex items-center justify-between gap-8 transition-all duration-500 text-left"
          >
            <div className="flex items-center gap-8">
                <div className={`w-24 h-24 rounded-[36px] ${card.bg} flex items-center justify-center shadow-inner relative group-hover:rotate-6 transition-all duration-500`}>
                    <div className={`absolute inset-0 rounded-[36px] bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className={`${card.accent} group-hover:text-white p-4 rounded-2xl relative z-10 transition-colors duration-500`}>
                        <card.icon size={44} strokeWidth={2.5} />
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-black text-[#1C1917] mb-1 tracking-tight">{card.title}</h2>
                    <p className="text-[#78716C] font-bold text-base uppercase tracking-widest leading-none opacity-60 group-hover:opacity-100 transition-opacity">{card.desc}</p>
                </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-[#1C1917] group-hover:text-white transition-all duration-500 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                <ArrowRight size={24} strokeWidth={3} />
            </div>
          </motion.button>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
        className="mt-28 flex flex-col items-center gap-6"
      >
          <div className="flex items-center gap-4">
              <div className="w-24 h-[2px] bg-gradient-to-r from-transparent to-[#1C1917] rounded-full" />
              <p className="text-[#1C1917] text-xs font-black tracking-[0.5em] uppercase">
                ESTABLISHED 2026
              </p>
              <div className="w-24 h-[2px] bg-gradient-to-l from-transparent to-[#1C1917] rounded-full" />
          </div>
          <p className="text-[10px] font-black text-[#78716C] tracking-widest uppercase">
            Curated by <span className="text-rose-500">Premium AI</span>
          </p>
      </motion.div>
    </div>
  );
}
