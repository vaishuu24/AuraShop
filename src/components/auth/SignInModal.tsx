'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { X } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Provider buttons ────────────────────────────────────────────────────
function ProviderButton({
  id,
  provider,
  label,
  icon,
  onClick,
  disabled,
}: {
  id: string;
  provider: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-4 border border-black/15 px-5 py-4 
                 hover:border-primary hover:bg-primary hover:text-background 
                 transition-all duration-200 group monospace text-[11px] font-bold disabled:opacity-50"
    >
      <span className="text-secondary group-hover:text-background transition-colors">{icon}</span>
      <span>{label}</span>
      <span className="ml-auto text-muted group-hover:text-background/60 text-[9px]">→</span>
    </button>
  );
}

// ── Google icon ─────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ── GitHub icon ─────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

// ── Main modal ──────────────────────────────────────────────────────────
export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleOAuth(provider: 'google' | 'github') {
    setLoading(provider);
    await signIn(provider, { callbackUrl: '/' });
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading('email');
    await signIn('resend', { email, redirect: false });
    setMagicSent(true);
    setLoading(null);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 z-[201] bg-background border-t border-black/15 
                       max-w-md mx-auto w-full rounded-t-none p-8 flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="monospace text-secondary text-[10px] font-bold">AUTH.PORTAL</span>
                <h2 className="text-2xl font-black italic mt-1">SIGN_IN</h2>
                <p className="text-muted text-xs monospace mt-1">ACCESS YOUR NEURAL ACCOUNT</p>
              </div>
              <button
                id="signin-modal-close"
                onClick={onClose}
                className="p-2 hover:bg-black/5 border border-black/10 transition-colors"
                aria-label="Close sign in modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-black/10" />
              <span className="monospace text-[9px] text-muted">OAUTH_PROVIDERS</span>
              <div className="flex-1 h-[1px] bg-black/10" />
            </div>

            {/* OAuth providers */}
            <div className="flex flex-col gap-3">
              <ProviderButton
                id="signin-google"
                provider="google"
                label="CONTINUE_WITH_GOOGLE"
                icon={<GoogleIcon />}
                onClick={() => handleOAuth('google')}
                disabled={loading !== null}
              />
              <ProviderButton
                id="signin-github"
                provider="github"
                label="CONTINUE_WITH_GITHUB"
                icon={<GitHubIcon />}
                onClick={() => handleOAuth('github')}
                disabled={loading !== null}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-black/10" />
              <span className="monospace text-[9px] text-muted">MAGIC_LINK</span>
              <div className="flex-1 h-[1px] bg-black/10" />
            </div>

            {/* Magic Link form */}
            {magicSent ? (
              <div className="border border-secondary/30 p-4 flex flex-col gap-2 bg-secondary/5">
                <span className="monospace text-secondary font-bold text-[10px]">LINK_DISPATCHED ✓</span>
                <p className="text-sm text-muted">
                  Check <strong>{email}</strong> — click the link to sign in. No password needed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="signin-email" className="monospace text-[9px] text-muted">
                    NEURAL_ID / EMAIL
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@domain.com"
                    required
                    className="border border-black/15 bg-transparent px-4 py-3 monospace text-[11px] 
                               focus:outline-none focus:border-primary placeholder:text-muted/50"
                  />
                </div>
                <button
                  id="signin-magic-link"
                  type="submit"
                  disabled={loading !== null || !email}
                  className="w-full bg-primary text-background px-6 py-4 monospace font-bold text-[11px] 
                             uppercase hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {loading === 'email' ? 'SENDING...' : 'SEND_MAGIC_LINK →'}
                </button>
              </form>
            )}

            {/* Trust note */}
            <p className="monospace text-[8px] text-muted text-center">
              SECURE · ENCRYPTED · NO PASSWORD STORED
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
