'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-[1800px] mx-auto min-h-screen flex flex-col gap-12">
      {/* HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* Left HUD: Metadata */}
        <div className="lg:col-span-2 flex flex-col gap-12 monospace text-muted">
          <div className="flex flex-col gap-2">
            <span className="text-secondary font-bold text-sm">01/WINTER</span>
            <div className="w-8 h-[1px] bg-secondary" />
            <span>COLLECTION.2025</span>
          </div>
          
          <div className="flex flex-col gap-1 text-[9px]">
            <span className="text-primary font-bold">SYS_ONLINE</span>
            <span>TRANS_ACTIVE</span>
            <span>SEC_ENCRYPTED</span>
          </div>
        </div>

        {/* Center: BIG HEADING */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-6xl md:text-[120px] leading-[0.8] font-black italic tracking-tighter text-primary">
              BEYOND <br />
              <span className="text-secondary">THE</span> <br />
              HORIZON
            </h1>
          </motion.div>
          
          <div className="max-w-md ml-auto lg:mr-20">
            <p className="text-muted text-sm leading-relaxed">
              VEXO represents the pinnacle of digital craftsmanship. Our Neural Series integrates biometric feedback with physical architecture, redefining the boundaries of human-digital interaction.
            </p>
          </div>
        </div>

        {/* Right HUD: Technical Data */}
        <div className="lg:col-span-2 flex flex-col items-end gap-12 monospace text-muted text-right">
          <div className="hud-border p-4 hud-bracket-tl hud-bracket-br">
            <span className="text-primary font-bold block">NEURAL_SYNC</span>
            <span className="text-[9px]">SIGNAL STRENGTH: 98%</span>
          </div>
          
          <div className="flex flex-col gap-1 text-[9px]">
            <span>LOC: 34.0522° N</span>
            <span>LNG: 118.2437° W</span>
          </div>
        </div>
      </section>

      {/* NEURAL SERIES GRID [PREVIEW] */}
      <section className="mt-20 border-t border-black/10 pt-20">
        <div className="flex justify-between items-end mb-12">
          <div className="flex flex-col gap-2">
             <span className="monospace text-secondary">PROJECT.ECHO</span>
             <h2 className="text-4xl font-black italic">NEURAL SERIES</h2>
          </div>
          <button className="monospace font-bold hover:text-secondary transition-colors underline decoration-secondary underline-offset-8">
            VIEW ALL PRODUCT [08]
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: '01', title: 'CORE_SHELL', price: '$840.00', cat: 'OUTERWEAR' },
            { id: '02', title: 'NEURAL_UNIT', price: '$1,200.00', cat: 'TECH' },
            { id: '03', title: 'VOID_FRAME', price: '$560.00', cat: 'ACCESSORY' },
            { id: '04', title: 'PULSE_VEST', price: '$920.00', cat: 'GEAR' },
          ].map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -10 }}
              className="bg-white/40 p-1 border border-black/5 flex flex-col gap-4 group cursor-pointer"
            >
              <div className="aspect-[3/4] bg-accent relative overflow-hidden flex items-center justify-center p-8">
                {/* HUD Corners */}
                <div className="absolute top-2 left-2 monospace text-[8px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.cat}
                </div>
                <div className="absolute bottom-2 right-2 monospace text-[8px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  v.2.5
                </div>
                
                {/* PLACEHOLDER PRODUCT IMAGE */}
                <div className="w-full h-full bg-black/5 border border-black/10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                   <span className="monospace text-[10px] text-primary">{item.title}</span>
                </div>
              </div>
              
              <div className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="monospace text-[10px] text-muted italic">INDX.{item.id}</span>
                  <span className="monospace text-[10px] font-bold text-secondary">{item.price}</span>
                </div>
                <h3 className="text-lg font-bold italic tracking-tight">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
