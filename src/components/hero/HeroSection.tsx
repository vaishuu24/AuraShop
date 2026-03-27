'use client';

import React, { useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const WORDS = ['BEYOND', 'THE', 'HORIZON'];

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftHudRef = useRef<HTMLDivElement>(null);
  const rightHudRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ── Word reveal on entry ─────────────────────────────────────────
      const words = headingRef.current?.querySelectorAll('.word-wrap');
      if (words) {
        gsap.fromTo(
          words,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.12,
          }
        );
      }

      // ── HUD panels fade in ───────────────────────────────────────────
      gsap.fromTo(
        [leftHudRef.current, rightHudRef.current],
        { opacity: 0, x: (i) => (i === 0 ? -24 : 24) },
        { opacity: 1, x: 0, duration: 1, delay: 0.4, ease: 'power3.out' }
      );

      // ── CTA slide up ─────────────────────────────────────────────────
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' }
      );

      // ── ScrollTrigger: scrub heading scale + parallax ────────────────
      if (!containerRef.current) return;

      gsap.to(headingRef.current, {
        scale: 0.88,
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // HUD panels drift apart on scroll
      gsap.to(leftHudRef.current, {
        x: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
      });

      gsap.to(rightHudRef.current, {
        x: 30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative min-h-[80vh] pt-4"
      aria-label="Hero"
    >
      {/* ── Left HUD ──────────────────────────────────────────────────── */}
      <div
        ref={leftHudRef}
        className="lg:col-span-2 flex flex-col gap-12 monospace text-muted"
      >
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

      {/* ── Centre: Heading ───────────────────────────────────────────── */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div className="overflow-hidden">
          <h1
            ref={headingRef}
            className="text-6xl md:text-[120px] leading-[0.85] font-black italic tracking-tighter text-primary origin-top-left"
            aria-label="Beyond The Horizon"
          >
            {WORDS.map((word, i) => (
              <span
                key={word}
                className="block overflow-hidden"
              >
                <span className="word-wrap block">
                  {i === 1 ? (
                    <>
                      <span className="text-secondary">{word}</span>
                    </>
                  ) : (
                    word
                  )}
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* Description + CTA */}
        <div ref={ctaRef} className="max-w-md ml-auto lg:mr-20 flex flex-col gap-6">
          <p className="text-muted text-sm leading-relaxed monospace">
            VEXO represents the pinnacle of digital craftsmanship. Our Neural
            Series integrates biometric feedback with physical architecture,
            redefining the boundaries of human-digital interaction.
          </p>

          <div className="flex items-center gap-6">
            {/* Primary CTA */}
            <Link
              href="/product/core-shell"
              id="hero-explore-cta"
              className="group relative inline-flex items-center gap-3 bg-primary text-background px-8 py-4 font-black italic tracking-tight text-sm uppercase overflow-hidden transition-all hover:bg-secondary"
            >
              <span className="relative z-10">EXPLORE_NOW</span>
              <span className="relative z-10 translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
              {/* Glitch shimmer on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[length:200%_100%] animate-[glitch_0.3s_ease_infinite]" />
            </Link>

            {/* Secondary ghost */}
            <span className="monospace text-muted text-[10px] flex flex-col">
              <span className="text-primary font-bold">[ 08 PRODUCTS ]</span>
              <span>NEURAL SERIES</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Right HUD ─────────────────────────────────────────────────── */}
      <div
        ref={rightHudRef}
        className="lg:col-span-2 flex flex-col items-end gap-12 monospace text-muted text-right"
      >
        <div className="hud-border p-4 hud-bracket-tl hud-bracket-br">
          <span className="text-primary font-bold block">NEURAL_SYNC</span>
          <span className="text-[9px]">SIGNAL STRENGTH: 98%</span>
        </div>
        <div className="flex flex-col gap-1 text-[9px]">
          <span>LOC: 34.0522° N</span>
          <span>LNG: 118.2437° W</span>
        </div>
        {/* Animated dot indicator */}
        <div className="flex flex-col items-end gap-2">
          {[100, 87, 72].map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[8px]">{v}%</span>
              <div className="w-16 h-[2px] bg-black/10 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-secondary"
                  style={{ width: `${v}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating scanline accent line ─────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
    </section>
  );
}
