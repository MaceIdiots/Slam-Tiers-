import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Star, Info, Copy, Check, Search, X, Download, Terminal, Bot, Code, Cpu } from 'lucide-react';
import { DiscordIcon } from './DiscordIcon';
import { DISCORD_LINK } from '../config';
import html2canvas from 'html2canvas';

const VALID_GAMEMODES = [
  { id: 'overall', name: 'Overall Points' },
  { id: 'mace', name: 'Mace' },
  { id: 'sword', name: 'Sword' },
  { id: 'diapot', name: 'Diamond Pot' },
  { id: 'nethpot', name: 'Netherite Pot' },
  { id: 'smp', name: 'SMP' },
  { id: 'builduhc', name: 'Build UHC' },
  { id: 'axe', name: 'Axe' },
  { id: 'crystal', name: 'Crystal' }
];

function TierBadge({ tier, size = 'sm' }: { tier: string; size?: 'sm' | 'md' | 'lg' }) {
  const normalized = (tier || '').toUpperCase().trim();
  
  // High fidelity responsive styles for SlamTiers (LT5 - HT1)
  let styles = 'bg-zinc-950/20 text-zinc-550 border border-zinc-900/40';
  let label = normalized || 'UNRANKED';

  if (normalized.startsWith('HT')) {
    if (normalized === 'HT1') {
      styles = 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-white border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.45)] font-extrabold animate-pulse';
    } else if (normalized === 'HT2') {
      styles = 'bg-gradient-to-r from-amber-500 to-orange-650 text-white border-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.35)] font-semibold';
    } else if (normalized === 'HT3') {
      styles = 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white border-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.35)] font-semibold';
    } else if (normalized === 'HT4') {
      styles = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-indigo-100 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] font-medium';
    } else if (normalized === 'HT5') {
      styles = 'bg-gradient-to-r from-violet-700 to-purple-900 text-purple-200 border-violet-500/50 shadow-[0_0_8px_rgba(139,92,246,0.2)] font-medium';
    } else {
      styles = 'bg-gradient-to-r from-purple-900 to-zinc-900 text-purple-300 border-purple-500/30';
    }
  } else if (normalized.startsWith('LT')) {
    if (normalized === 'LT1') {
      styles = 'bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-500 text-zinc-950 border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)] font-extrabold';
    } else if (normalized === 'LT2') {
      styles = 'bg-gradient-to-r from-blue-500 to-teal-600 text-white border-blue-400 font-semibold';
    } else if (normalized === 'LT3') {
      styles = 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-emerald-50 border-emerald-400 font-semibold';
    } else if (normalized === 'LT4') {
      styles = 'bg-gradient-to-r from-amber-700 to-orange-850 text-amber-100 border-orange-600/50 font-semibold';
    } else if (normalized === 'LT5') {
      styles = 'bg-gradient-to-r from-zinc-650 to-zinc-800 text-zinc-300 border-zinc-500/55 font-semibold';
    } else {
      styles = 'bg-gradient-to-r from-zinc-750 to-zinc-900 text-zinc-450 border-zinc-700/50';
    }
  } else if (normalized === 'UNRANKED' || normalized === 'NONE' || !normalized) {
    styles = 'bg-zinc-950/40 text-zinc-600 border border-zinc-900/40 font-semibold';
    label = 'UNRANKED';
  }

  const paddingClass = size === 'lg' 
    ? 'px-3.5 py-1.5 text-xs tracking-wider' 
    : size === 'md' 
      ? 'px-2.5 py-1 text-[11px]' 
      : 'px-2 py-0.5 text-[9px] sm:text-[10px]';

  return (
    <span className={`inline-flex items-center justify-center rounded-lg border text-center uppercase font-mono tracking-wide ${paddingClass} ${styles}`}>
      {label}
    </span>
  );
}

function getGamemodeIcon(id: string) {
  const normId = id.toLowerCase();
  if (normId === 'sword') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
        <defs>
          <linearGradient id="swordGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <path d="M18.5 5.5 L15.5 2.5 L10.5 7.5 L7.5 10.5 L13.5 16.5 L18.5 11.5 Z" fill="url(#swordGrad)" stroke="#0284c7" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M15.5 2.5 L13.5 4.5 L10.5 7.5 M13.5 16.5 L12 15 L10 13" stroke="#e0f2fe" strokeWidth="1" strokeLinecap="round" />
        <path d="M7.5 10.5 L6.5 9.5 L5 11 L6.5 12.5 L10.5 16.5 L12 18 L13.5 16.5 Z" fill="#475569" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4.5 13.5 L7.5 16.5 L6.5 17.5 L3.5 14.5 Z" fill="#64748b" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6.5 17.5 L3.5 20.5 L5 22 L8 19 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="4" cy="21" r="1.5" fill="#f59e0b" />
      </svg>
    );
  }
  if (normId === 'mace') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
        <defs>
          <linearGradient id="maceGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <path d="M6 18 L15 9" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M5 19 L4 20" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <rect x="13.5" y="4.5" width="6" height="6" rx="1.5" transform="rotate(45 16.5 7.5)" fill="url(#maceGrad)" stroke="#b45309" strokeWidth="1.5" />
        <rect x="15.5" y="6.5" width="2" height="2" fill="#fef3c7" />
        <path d="M16.5 2 L16.5 4" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 7.5 L20 7.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 7.5 L13 7.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.5 13 L16.5 11" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (normId === 'diapot') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
        <defs>
          <linearGradient id="potDia" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        <rect x="11" y="2" width="2" height="2.5" rx="0.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
        <rect x="10" y="4.5" width="4" height="2" rx="0.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
        <path d="M9 7 L15 7 L18 11.5 L18 18.5 C18 20 16.5 21 15 21 L9 21 C7.5 21 6 20 6 18.5 L6 11.5 Z" fill="url(#potDia)" stroke="#0891b2" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 12 L8 19" stroke="#cffafe" strokeWidth="1" strokeLinecap="round" />
        <circle cx="12" cy="14" r="1.5" fill="#e0f7fa" />
        <circle cx="14" cy="17" r="1" fill="#e0f7fa" />
      </svg>
    );
  }
  if (normId === 'nethpot') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
        <defs>
          <linearGradient id="potNeth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#701a75" />
          </linearGradient>
        </defs>
        <rect x="11" y="2" width="2" height="2.5" rx="0.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
        <rect x="10" y="4.5" width="4" height="2" rx="0.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
        <path d="M9 7 L15 7 L18 11.5 L18 18.5 C18 20 16.5 21 15 21 L9 21 C7.5 21 6 20 6 18.5 L6 11.5 Z" fill="url(#potNeth)" stroke="#a21caf" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 12 L8 19" stroke="#fdf4ff" strokeWidth="1" strokeLinecap="round" />
        <circle cx="12" cy="14" r="1.5" fill="#fae8ff" />
        <circle cx="10" cy="17" r="1" fill="#fae8ff" />
      </svg>
    );
  }
  if (normId === 'smp') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
        <path d="M12 2 L20 6 L12 10 L4 6 Z" fill="#10b981" stroke="#047857" strokeWidth="1" />
        <path d="M4 6 L12 10 L12 21 L4 17 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        <path d="M12 10 L20 6 L20 17 L12 21 Z" fill="#92400e" stroke="#451a03" strokeWidth="1" />
        <path d="M4 6 L6 8 L8 7 L10 9 L12 10 L14 9 L16 8 L18 8.5 L20 6 L20 9 L18 10 L16 9 L14 11 L12 10 L10 12 L8 10 L6 11 L4 9 Z" fill="#059669" />
      </svg>
    );
  }
  if (normId === 'builduhc') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
        <defs>
          <linearGradient id="gApple" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <path d="M12 6 Q13 3 15 3.5" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 7 C10 5, 5 5, 5 11 C5 16, 9 20, 12 21 C15 20, 19 16, 19 11 C19 5, 14 5, 12 7 Z" fill="url(#gApple)" stroke="#b45309" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 9 C7.5 11, 7.5 13, 8.5 15" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" />
        <circle cx="14.5" cy="14" r="1.5" fill="#fef3c7" />
      </svg>
    );
  }
  if (normId === 'axe') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
        <path d="M5 21 L18 4.5" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        <path d="M13 5 L18 3 C19.5 5, 20 8, 17 11.5 L12.5 8 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M15.5 4.5 C16.5 6.5, 16.5 8, 15 9.5" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="18" cy="4" r="1" fill="#cbd5e1" />
      </svg>
    );
  }
  if (normId === 'crystal') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
        <defs>
          <linearGradient id="crysGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <path d="M6 20 L18 20 L16 22 L8 22 Z" fill="#1e1b4b" stroke="#312e81" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="7" y="5" width="10" height="10" rx="1" stroke="#fabad4" strokeWidth="1" strokeDasharray="1.5 1" fill="#ec4899" fillOpacity="0.05" transform="rotate(45 12 10)" />
        <path d="M12 4 L16 10 L12 16 L8 10 Z" fill="url(#crysGrad)" stroke="#db2777" strokeWidth="1" strokeLinejoin="round" />
        <line x1="12" y1="4" x2="12" y2="16" stroke="#fce7f3" strokeWidth="0.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-zinc-400 shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function getAchievementTitleStyles(points: number): string {
  if (points >= 400) {
    return "bg-gradient-to-r from-amber-500/25 via-yellow-500/15 to-orange-500/25 text-yellow-250 border-amber-400/60 shadow-[0_0_15px_rgba(234,179,8,0.3)] font-bold tracking-wide";
  }
  if (points >= 250) {
    return "bg-gradient-to-r from-purple-600/30 via-fuchsia-500/20 to-indigo-600/30 text-purple-200 border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.25)] font-semibold";
  }
  if (points >= 100) {
    return "bg-gradient-to-r from-cyan-500/25 via-sky-500/20 to-teal-500/25 text-cyan-200 border-cyan-400/45 shadow-[0_0_10px_rgba(34,211,238,0.2)] font-semibold";
  }
  if (points >= 50) {
    return "bg-gradient-to-r from-orange-500/25 via-amber-600/20 to-red-500/25 text-orange-200 border-orange-400/45 shadow-[0_0_8px_rgba(249,115,22,0.18)] font-semibold";
  }
  if (points >= 20) {
    return "bg-gradient-to-r from-indigo-500/25 via-blue-600/20 to-indigo-500/25 text-indigo-200 border-indigo-400/45 shadow-[0_0_8px_rgba(99,102,241,0.15)] font-semibold";
  }
  if (points >= 10) {
    return "bg-gradient-to-r from-red-500/25 via-rose-500/20 to-pink-500/25 text-red-200 border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.15)] font-semibold";
  }
  return "bg-gradient-to-r from-zinc-800/50 via-zinc-900/60 to-zinc-855/50 border-zinc-800 text-zinc-400 font-medium";
}

export function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState('overall');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoPopover, setShowInfoPopover] = useState(false);
  const [popoverTab, setPopoverTab] = useState<'titles' | 'points'>('titles');
  const [copied, setCopied] = useState(false);

  // Search & inspect state variables for player analysis
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState<string>('');

  // Discord Bot developer-center and live simulator states
  const [showBotHubModal, setShowBotHubModal] = useState(false);
  const [botLanguage, setBotLanguage] = useState<'node' | 'python'>('node');
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [simUsername, setSimUsername] = useState('Steve');
  const [simDiscordId, setSimDiscordId] = useState('731320713892742918');
  const [simGamemode, setSimGamemode] = useState('sword');
  const [simTier, setSimTier] = useState('HT2');
  const [simPoints, setSimPoints] = useState('30');
  const [simLoading, setSimLoading] = useState(false);
  const [simSuccess, setSimSuccess] = useState<string | null>(null);
  const [simError, setSimError] = useState<string | null>(null);

  const handleSimulateBotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simUsername.trim() || !simDiscordId.trim()) {
      setSimError('Please fill in both Minecraft Username and Discord ID.');
      return;
    }
    setSimLoading(true);
    setSimError(null);
    setSimSuccess(null);

    try {
      const response = await fetch('/api/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer A@V>Wr]qs~_,?6E#*L9)2=4dXxc4PNdE'
        },
        body: JSON.stringify({
          discordId: simDiscordId.trim(),
          username: simUsername.trim(),
          gamemode: simGamemode,
          tier: simTier,
          points: Number(simPoints) || 0
        })
      });

      const resJson = await response.json();
      if (response.ok && resJson.success) {
        setSimSuccess('Success! Bot integration tested. Database record merged successfully!');
        // Refresh live rankings to show the newly updated player instantly
        setTimeout(() => {
          fetchRankings(activeTab);
        }, 150);
      } else {
        setSimError(resJson.error || 'Connection failed. Check authentication secret headers or fields.');
      }
    } catch (err: any) {
      setSimError(`Connection error: ${err.message || err}`);
    } finally {
      setSimLoading(false);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const loadAvatarBase64 = async (username: string): Promise<string> => {
    try {
      const response = await fetch(`https://mc-heads.net/avatar/${username}/100.png`, {
        cache: 'no-store'
      });
      if (response.ok) {
        const blob = await response.blob();
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(blob);
        });
      }
    } catch (e) {
      console.warn("CORS fetch failed for mc-heads, falling back to direct URL:", e);
    }
    return `https://mc-heads.net/avatar/${username}/100.png`;
  };

  const handleDownloadCard = async () => {
    const el = document.getElementById('player-stats-card-capture');
    if (!el) return;

    setIsDownloading(true);

    const canvasEl = document.createElement('canvas');
    canvasEl.width = 1;
    canvasEl.height = 1;
    const ctx = canvasEl.getContext('2d');

    // Safe color resolver that converts modern oklch/oklab to standard hex/rgba colors
    const resolveToSafeColor = (colorStr: string): string => {
      if (!colorStr) return colorStr;
      if (!colorStr.includes('oklch') && !colorStr.includes('oklab')) {
        return colorStr;
      }

      try {
        return colorStr.replace(/(oklch|oklab)\([^)]+\)/g, (match) => {
          if (ctx) {
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillStyle = match;
            const resVal = ctx.fillStyle;
            if (resVal && resVal !== 'rgba(0,0,0,0)' && resVal !== 'transparent') {
              return resVal;
            }
          }
          // Manual high-fidelity fallbacks for Tailwind v4 colors
          if (match.includes('0.627') || match.includes('0.585') || match.includes('0.5') || match.includes('0.4')) {
            return 'rgb(168, 85, 247)'; // Gorgeous purple
          }
          if (match.includes('0.982') || match.includes('0.9') || match.includes('0.95')) {
            return 'rgb(244, 244, 245)'; // Off-white/slate-50
          }
          if (match.includes('0.12') || match.includes('0.15') || match.includes('0.17') || match.includes('0.09')) {
            return 'rgb(12, 16, 27)'; // Slate dark background
          }
          return 'rgb(168, 85, 247)'; // Default purple fallback
        });
      } catch (e) {
        return colorStr
          .replace(/oklch\([^)]+\)/g, 'rgb(168, 85, 247)')
          .replace(/oklab\([^)]+\)/g, 'rgb(168, 85, 247)');
      }
    };

    // Proxy the main window's getComputedStyle to sanitize values dynamically during html2canvas traverse
    const originalMainGetComputed = window.getComputedStyle;
    window.getComputedStyle = function (elt, pseudoElt) {
      const style = originalMainGetComputed.call(this, elt, pseudoElt);
      return new Proxy(style, {
        get(target, prop) {
          const val = Reflect.get(target, prop);
          if (typeof val === 'string') {
            if (val.includes('oklch') || val.includes('oklab')) {
              return resolveToSafeColor(val);
            }
          } else if (typeof val === 'function') {
            if (prop === 'getPropertyValue') {
              return function (propertyName: string) {
                const rawVal = target.getPropertyValue(propertyName);
                if (rawVal && (rawVal.includes('oklch') || rawVal.includes('oklab'))) {
                  return resolveToSafeColor(rawVal);
                }
                return rawVal;
              };
            }
            return val.bind(target);
          }
          return val;
        }
      });
    };

    const styleBackups: { element: HTMLStyleElement; originalText: string }[] = [];
    const linkBackups: { element: HTMLLinkElement; originalDisabled: boolean }[] = [];
    const tempStyleElements: HTMLStyleElement[] = [];

    try {
      // 1. Sanitize all <style> elements by replacing oklch/oklab with safe fallback rgb colors
      const styleElements = Array.from(document.querySelectorAll('style'));
      styleElements.forEach((style) => {
        const text = style.innerHTML;
        if (text.includes('oklch') || text.includes('oklab')) {
          styleBackups.push({ element: style, originalText: text });
          style.innerHTML = text
            .replace(/oklch\([^)]+\)/g, 'rgb(147, 51, 234)')
            .replace(/oklab\([^)]+\)/g, 'rgb(147, 51, 234)');
        }
      });

      // 2. Temporarily replace <link rel="stylesheet"> elements that might contain oklch/oklab so html2canvas ignores them.
      const linkElements = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
      for (const link of linkElements) {
        linkBackups.push({ element: link, originalDisabled: link.disabled });
        try {
          let hasOklch = false;
          if (link.sheet) {
            try {
              const rules = Array.from(link.sheet.cssRules);
              hasOklch = rules.some(r => r.cssText.includes('oklch') || r.cssText.includes('oklab'));
            } catch (e) {
              hasOklch = true; // safe fallback assumption (e.g. CORS protected)
            }
          } else {
            hasOklch = true;
          }

          if (hasOklch && link.href) {
            const response = await fetch(link.href);
            if (response.ok) {
              const cssText = await response.text();
              const sanitizedCss = cssText
                .replace(/oklch\([^)]+\)/g, 'rgb(147, 51, 234)')
                .replace(/oklab\([^)]+\)/g, 'rgb(147, 51, 234)');
              
              const tempStyle = document.createElement('style');
              tempStyle.innerHTML = sanitizedCss;
              document.head.appendChild(tempStyle);
              tempStyleElements.push(tempStyle);

              link.disabled = true;
            }
          }
        } catch (linkErr) {
          console.warn("Failed to sanitize stylesheet link, disabling during capture:", link.href, linkErr);
          link.disabled = true;
        }
      }

      // Small lag to ensure state and DOM are fully synchronized
      await new Promise((r) => setTimeout(r, 150));

      const canvas = await html2canvas(el, {
        useCORS: true,
        allowTaint: true,
        scale: 3, // Very high definition 3x resolution render
        backgroundColor: '#0c101b',
        logging: false,
        onclone: (clonedDoc) => {
          // A. Proxy the cloned window's getComputedStyle to sanitize values dynamically inside the cloned iframe context
          const clonedWindow = clonedDoc.defaultView;
          if (clonedWindow) {
            const originalGetComputed = clonedWindow.getComputedStyle;
            clonedWindow.getComputedStyle = function (elt, pseudoElt) {
              const style = originalGetComputed.call(this, elt, pseudoElt);
              return new Proxy(style, {
                get(target, prop) {
                  const val = Reflect.get(target, prop);
                  if (typeof val === 'string') {
                    if (val.includes('oklch') || val.includes('oklab')) {
                      return resolveToSafeColor(val);
                    }
                  } else if (typeof val === 'function') {
                    if (prop === 'getPropertyValue') {
                      return function (propertyName: string) {
                        const rawVal = target.getPropertyValue(propertyName);
                        if (rawVal && (rawVal.includes('oklch') || rawVal.includes('oklab'))) {
                          return resolveToSafeColor(rawVal);
                        }
                        return rawVal;
                      };
                    }
                    return val.bind(target);
                  }
                  return val;
                }
              });
            };
          }

          // B. Sanitize all style tags within the cloned document
          try {
            const styleTags = clonedDoc.querySelectorAll('style');
            styleTags.forEach((styleTag) => {
              let cssText = styleTag.innerHTML;
              if (cssText.includes('oklch') || cssText.includes('oklab')) {
                cssText = resolveToSafeColor(cssText);
                styleTag.innerHTML = cssText;
              }
            });
          } catch (errStyle) {
            console.warn("Failed to sanitize onclone style tags:", errStyle);
          }

          // C. Sanitize all cloned styleSheets to remove or convert oklch/oklab rule declarations
          try {
            const sheets = Array.from(clonedDoc.styleSheets);
            sheets.forEach((sheet) => {
              try {
                const rules = Array.from(sheet.cssRules || sheet.rules);
                rules.forEach((rule) => {
                  if (rule instanceof CSSStyleRule) {
                    const style = rule.style;
                    for (let i = 0; i < style.length; i++) {
                      const prop = style[i];
                      const val = style.getPropertyValue(prop);
                      if (val && (val.includes('oklch') || val.includes('oklab'))) {
                        try {
                          style.setProperty(prop, resolveToSafeColor(val));
                        } catch (e) {
                          // Ignore read-only rules
                        }
                      }
                    }
                  }
                });
              } catch (sheetErr) {
                console.warn("Failed to sanitize stylesheet rule contents (CORS or read-only):", sheetErr);
              }
            });
          } catch (errSheets) {
            console.warn("Failed to map cloned styleSheets:", errSheets);
          }

          // D. Locate card capture element
          const target = clonedDoc.getElementById('player-stats-card-capture');
          if (target) {
            // Apply perfect styles for standalone high-quality collection card export
            target.style.borderRadius = '24px';
            target.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.95)';
            target.style.border = '1px solid rgba(168, 85, 247, 0.2)';
            target.style.padding = '32px';
            target.style.width = '420px';
            target.style.maxWidth = '100%';
            target.style.margin = '0 auto';

            // E. Loop through all element styles in the capture container to replace computed colors dynamically
            try {
              const colorProps = [
                'color',
                'backgroundColor',
                'borderColor',
                'borderTopColor',
                'borderBottomColor',
                'borderLeftColor',
                'borderRightColor',
                'boxShadow',
                'textShadow',
                'stroke',
                'fill'
              ];

              const allElements = [target, ...Array.from(target.querySelectorAll('*'))];
              allElements.forEach((element) => {
                if (!(element instanceof HTMLElement)) return;

                const computed = clonedDoc.defaultView
                  ? clonedDoc.defaultView.getComputedStyle(element)
                  : window.getComputedStyle(element);

                colorProps.forEach((prop) => {
                  const cssVal = computed[prop as any];
                  if (typeof cssVal === 'string' && (cssVal.includes('oklch') || cssVal.includes('oklab'))) {
                    const safeVal = resolveToSafeColor(cssVal);
                    element.style[prop as any] = safeVal;
                  }
                });

                // Check background images / linear gradients
                const bgImg = computed.backgroundImage;
                if (bgImg && (bgImg.includes('oklch') || bgImg.includes('oklab'))) {
                  element.style.backgroundImage = resolveToSafeColor(bgImg);
                }
              });
            } catch (errElements) {
              console.warn("Failed to sanitize onclone elements:", errElements);
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${searchResult?.username || 'player'}_slamtiers_stats.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error("Failed to generate or download card:", err);
    } finally {
      // 1. Restore original style tags content in the main document
      styleBackups.forEach(({ element, originalText }) => {
        try {
          element.innerHTML = originalText;
        } catch (e) {
          console.warn("Failed to restore style element content:", e);
        }
      });

      // 2. Restore disabled status on original stylesheet links
      linkBackups.forEach(({ element, originalDisabled }) => {
        try {
          element.disabled = originalDisabled;
        } catch (e) {
          console.warn("Failed to restore link element disabled status:", e);
        }
      });

      // 3. Remove all temporary sanitized style elements
      tempStyleElements.forEach((tempStyle) => {
        try {
          if (tempStyle.parentNode) {
            tempStyle.parentNode.removeChild(tempStyle);
          }
        } catch (e) {
          console.warn("Failed to remove temporary style element:", e);
        }
      });

      // Always restore original getComputedStyle on cleanup
      window.getComputedStyle = originalMainGetComputed;
      setIsDownloading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/player?username=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.player) {
          setSearchResult(json.player);
          setSearchError(null);
          // Pre-fetch Base64 representation of player's Minecraft avatar for high-fidelity offline card download
          setAvatarBase64('');
          loadAvatarBase64(json.player.username).then(base64 => {
            setAvatarBase64(base64);
          });
        } else {
          setSearchError('Player profile not found.');
          setSearchResult(null);
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setSearchError(errJson.error || 'Player profile not found or unranked.');
        setSearchResult(null);
      }
    } catch (err) {
      console.error("Search API failed:", err);
      setSearchError("Unable to connect to profiles server.");
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleInspectPlayer = async (username: string) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/player?username=${encodeURIComponent(username)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.player) {
          setSearchResult(json.player);
          setSearchError(null);
          // Pre-fetch Base64 representation of player's Minecraft avatar for high-fidelity offline card download
          setAvatarBase64('');
          loadAvatarBase64(json.player.username).then(base64 => {
            setAvatarBase64(base64);
          });
          // Gently scroll up to view the selected player profile card
          document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err) {
      console.error("Failed to inspect profile:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('mcpvp.club');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyEndpoint = () => {
    const apiEndpoint = `${window.location.origin}/api/promote`;
    navigator.clipboard.writeText(apiEndpoint);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  const copyToken = () => {
    navigator.clipboard.writeText('A@V>Wr]qs~_,?6E#*L9)2=4dXxc4PNdE');
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Fetch from the live Serverless API
  const fetchRankings = async (modeId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?mode=${modeId}`);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.leaderboard) {
          setData(json.leaderboard);
        } else {
          setData([]);
        }
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch live leaderboard:", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings(activeTab);
    setCurrentPage(1);
  }, [activeTab]);

  // Lock body scroll when any modal is open to ensure no scroll down can occur
  useEffect(() => {
    if (searchResult || showBotHubModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchResult, showBotHubModal]);

  return (
    <section id="leaderboard" className="py-24 px-4 relative z-10 max-w-7xl mx-auto">
      {/* Decorative center glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-4">
          SlamTiers Leaderboard
        </h2>
        <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full mb-4" />
      </motion.div>

      {/* Search Bar Input Form */}
      <div className="max-w-md mx-auto mb-10 relative z-30">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <input
            type="text"
            placeholder="Search player username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950/70 border border-zinc-800 hover:border-purple-500/50 focus:border-purple-500 focus:outline-none rounded-2xl px-5 py-4 pl-12 text-sm text-white placeholder-zinc-500 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.5)] leading-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-hover:text-purple-400 transition-colors" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/40 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={searchLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-850 text-white text-xs font-semibold rounded-xl tracking-wide transition-all duration-200 cursor-pointer shadow-md"
          >
            {searchLoading ? '...' : 'Enter'}
          </button>
        </form>
        {searchError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 text-left mt-2 pl-3"
          >
            ⚠️ {searchError}
          </motion.p>
        )}
      </div>

      {/* Detailed Searched Player Profile Modal */}
      <AnimatePresence>
        {searchResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSearchResult(null)} />
            
            <motion.div
              key="profile-modal"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative w-full max-w-[460px] bg-[#0c101b]/98 border border-zinc-850/60 rounded-3xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden text-center text-white z-55"
            >
              {/* SlamTiers style background subtle glow */}
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
              
              {/* Close Button */}
              <button
                onClick={() => setSearchResult(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/60 hover:bg-zinc-850 hover:text-white text-zinc-400 border border-zinc-800/60 transition-all cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <div id="player-stats-card-capture" className="relative text-center w-full bg-[#0c101b] rounded-2xl p-1">
                {/* Branding Header in high visual quality card */}
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-zinc-800/40">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple-500 shadow-sm" />
                    <span className="font-sans font-black text-[10px] tracking-wider text-zinc-300">SLAMTIERS COMPETITIVE</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-450 uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-lg font-bold">
                    OFFICIAL RECORD
                  </span>
                </div>

                <div className="relative mx-auto mt-2 mb-2 w-20 h-20 flex items-center justify-center select-none">
                  <div className={`absolute inset-0 blur-md opacity-40 pointer-events-none ${
                    searchResult.overallPoints >= 400 ? 'bg-amber-400' :
                    searchResult.overallPoints >= 250 ? 'bg-fuchsia-500' :
                    searchResult.overallPoints >= 100 ? 'bg-cyan-400' :
                    'bg-purple-600'
                  }`} />
                  <div className={`relative w-18 h-18 rounded-none border-2 bg-zinc-950 flex items-center justify-center shrink-0 z-10 p-1 transition-transform duration-300 hover:scale-[1.03] ${
                    searchResult.overallPoints >= 400 ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]' :
                    searchResult.overallPoints >= 250 ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]' :
                    searchResult.overallPoints >= 100 ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' :
                    'border-zinc-750 shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
                  }`}>
                    <img
                      src={avatarBase64 || `https://mc-heads.net/avatar/${searchResult.username}/100.png`}
                      alt={`${searchResult.username}'s Head`}
                      className="w-full h-full object-contain rounded-none"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = `https://minotar.net/helm/${searchResult.username}/100.png`;
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <h3 className="font-display text-xl md:text-2xl font-black text-white tracking-wide">
                  {searchResult.username}
                </h3>
                {/* Combat Title / Badge Pill */}
                <div className="mt-2 flex justify-center">
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold font-mono tracking-wide shadow-sm border ${getAchievementTitleStyles(searchResult.overallPoints)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {searchResult.achievementTitle || 'Rookie Combatant'}
                  </span>
                </div>
                


                {/* Position Subsection */}
                {(() => {
                  const rankIndex = data.findIndex(p => p.username?.toLowerCase() === searchResult.username?.toLowerCase());
                  const playerRank = rankIndex >= 0 ? rankIndex + 1 : null;
                  const pointsValue = activeTab === 'overall' ? searchResult.overallPoints : (searchResult.gamemodes?.[activeTab]?.points || 0);
                  const pointsLabel = 'PTS';
                  const tabTitle = VALID_GAMEMODES.find(g => g.id === activeTab)?.name || 'Overall';

                  return (
                    <div className="mt-4 text-left">
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1.5 select-none font-semibold">
                        Standing Position
                      </h4>
                      
                      {/* POSITION BANNER */}
                      <div className="relative flex items-stretch select-none h-10 w-full overflow-hidden rounded-xl border border-zinc-800/70 shadow-md">
                        {/* Left Block - Slanted Yellow Rank indicator */}
                        <div className="relative flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 px-5 text-zinc-950 font-sans italic font-black text-base shadow-[inset_-2px_0_6px_rgba(0,0,0,0.15)] z-10 shrink-0">
                          {playerRank ? `${playerRank}.` : 'N/A'}
                          {/* Custom visual cut effect via absolute slant */}
                          <div 
                            className="absolute right-0 top-0 bottom-0 w-4 bg-amber-500 transform skew-x-[15deg] translate-x-1.5" 
                            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%, 0 0)' }}
                          />
                        </div>
                        
                        {/* Right Block - Slate pill */}
                        <div className="flex-grow flex items-center justify-between pl-5 pr-4 bg-[#111624] text-white">
                          <div className="flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-200">
                              {tabTitle}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] font-semibold text-zinc-400">
                            (<span className="text-purple-400 font-bold">{pointsValue}</span> {pointsLabel})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Gamemodes Standings Subsection */}
                <div className="mt-4 text-left">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2 select-none font-semibold">
                    Gamemodes Record
                  </h4>
                  
                  <div className="bg-[#121622]/40 border border-zinc-800/60 rounded-2xl p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {VALID_GAMEMODES.filter(g => g.id !== 'overall').map((gm) => {
                        const gmStat = searchResult.gamemodes?.[gm.id];
                        const hasStat = !!gmStat && gmStat.tier && gmStat.tier !== 'NONE';
                        const tier = hasStat ? gmStat.tier : 'UNRANKED';
                        const pts = gmStat ? (gmStat.points !== undefined ? Number(gmStat.points) : 0) : 0;
                        
                        return (
                          <div key={gm.id} className="flex items-center justify-between p-2 bg-zinc-950/40 border border-zinc-900/60 rounded-xl hover:border-zinc-850 transition-colors">
                            <div className="flex items-center gap-2 max-w-[65%] pl-1">
                              <div className="flex flex-col min-w-0">
                                <span className="text-[9.5px] font-sans font-bold text-zinc-300 leading-tight truncate">
                                  {gm.name}
                                </span>
                                <span className="text-[8.5px] font-mono text-zinc-500 leading-none mt-0.5">
                                  {pts > 0 ? `${pts} PTS` : '0 -'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="shrink-0 leading-none">
                              <TierBadge tier={tier} size="sm" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>


              
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gamemode Tab Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-4xl mx-auto">
        {VALID_GAMEMODES.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                : 'bg-zinc-900/60 text-zinc-450 border border-zinc-800/45 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Leaderboard Table / Container */}
      <div className="max-w-4xl mx-auto relative">
        
        {/* Action Toolbar with Information & Server IP */}
        <div className="flex flex-wrap items-center justify-end gap-3 mb-5 px-1 relative z-30">
          <div className="flex flex-wrap items-center gap-3">
            {/* Information Button */}
            <div className="relative">
              <button
                onClick={() => setShowInfoPopover(!showInfoPopover)}
                id="info_popover_btn"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  showInfoPopover 
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]' 
                    : 'bg-zinc-950/40 text-zinc-300 border border-zinc-800/80 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <Info className="w-4 h-4 text-purple-400" />
                <span>Information</span>
              </button>

              {/* Dynamic Popover */}
              <AnimatePresence>
                {showInfoPopover && (
                  <>
                    {/* Fixed full screen click-escape overlay */}
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setShowInfoPopover(false)} 
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 sm:w-[360px] bg-zinc-950/95 border border-zinc-800/90 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.85)] backdrop-blur-md z-50 overflow-hidden"
                    >
                      {/* Segmented Control */}
                      <div className="bg-zinc-900/60 p-0.5 rounded-xl flex gap-1 mb-4">
                        <button
                          onClick={() => setPopoverTab('titles')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                            popoverTab === 'titles'
                              ? 'bg-zinc-800 text-white shadow-md'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Titles
                        </button>
                        <button
                          onClick={() => setPopoverTab('points')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                            popoverTab === 'points'
                              ? 'bg-zinc-800 text-white shadow-md'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Points
                        </button>
                      </div>

                      {/* Content Switcher */}
                      {popoverTab === 'titles' ? (
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 select-none">
                          <h4 className="text-xs font-normal text-zinc-300 leading-normal mb-2">
                            How to obtain <span className="underline decoration-purple-500/80 decoration-2 font-semibold text-white">Achievement Titles</span>:
                          </h4>
                                                 <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">👑</span>
                            <div>
                              <span className="text-xs font-black bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent block">Combat Grandmaster</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 400+ total points.</span>
                              <span className="text-[9px] text-amber-500/85 font-mono tracking-wider uppercase font-semibold">Absolute Top Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">⚔️</span>
                            <div>
                              <span className="text-xs font-bold bg-gradient-to-r from-purple-300 via-fuchsia-250 to-indigo-300 bg-clip-text text-transparent block">Combat Master</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 250+ total points.</span>
                              <span className="text-[9px] text-purple-400/85 font-mono tracking-wider uppercase font-semibold">Elite Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">💎</span>
                            <div>
                              <span className="text-xs font-bold bg-gradient-to-r from-cyan-300 via-sky-200 to-teal-300 bg-clip-text text-transparent block">Combat Ace</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 100+ total points.</span>
                              <span className="text-[9px] text-cyan-400/85 font-mono tracking-wider uppercase font-semibold">High Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">🔥</span>
                            <div>
                              <span className="text-xs font-bold bg-gradient-to-r from-orange-400 via-amber-300 to-red-400 bg-clip-text text-transparent block">Combat Specialist</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 50+ total points.</span>
                              <span className="text-[9px] text-orange-400/85 font-mono tracking-wider uppercase font-semibold">Mid Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">🛡️</span>
                            <div>
                              <span className="text-xs font-bold bg-gradient-to-r from-blue-300 via-indigo-200 to-violet-300 bg-clip-text text-transparent block">Combat Cadet</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 20+ total points.</span>
                              <span className="text-[9px] text-indigo-400/85 font-mono tracking-wider uppercase font-semibold">Novice Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0">🎯</span>
                            <div>
                              <span className="text-xs font-bold bg-gradient-to-r from-rose-300 via-pink-200 to-red-300 bg-clip-text text-transparent block">Combat Novice</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Obtained 10+ total points.</span>
                              <span className="text-[9px] text-red-400/85 font-mono tracking-wider uppercase font-semibold">Beginner Tier</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 pt-1 border-t border-zinc-900">
                            <span className="text-lg shrink-0">🪵</span>
                            <div>
                              <span className="text-xs font-bold text-zinc-400 block">Rookie</span>
                              <span className="text-[10px] text-zinc-400 block leading-normal">Under 10 Points.</span>
                              <span className="text-[9px] text-zinc-550 font-mono tracking-wider uppercase">Unranked / Starting Tier</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                          <h4 className="text-xs font-normal text-zinc-300 leading-normal mb-2">
                            How to obtain <span className="underline decoration-purple-500/80 decoration-2 font-semibold text-white">Points</span>:
                          </h4>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            Points accumulate cumulatively across active gamemodes. Your verified tier on any gamemode dictates your specific contributions:
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-[11px] select-none font-sans">
                            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex justify-between">
                              <span className="text-purple-300 font-bold">HT1 / LT1</span>
                              <span className="text-zinc-200">40 / 35 pts</span>
                            </div>
                            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex justify-between">
                              <span className="text-purple-300 font-bold">HT2 / LT2</span>
                              <span className="text-zinc-200">30 / 25 pts</span>
                            </div>
                            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex justify-between">
                              <span className="text-purple-300 font-bold">HT3 / LT3</span>
                              <span className="text-zinc-200">20 / 15 pts</span>
                            </div>
                            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex justify-between">
                              <span className="text-purple-300 font-bold">HT4 / LT4</span>
                              <span className="text-zinc-200">12 / 8 pts</span>
                            </div>
                            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex justify-between col-span-2">
                              <span className="text-purple-300 font-bold">HT5 / LT5</span>
                              <span className="text-zinc-200">5 / 2 pts</span>
                            </div>
                          </div>

                          <div className="p-3 bg-purple-950/25 border border-purple-900/45 rounded-xl text-[10px] text-purple-300 leading-relaxed">
                            💡 Updating dynamic playstyles (such as Sword, Mace, SMP) merges under your universal overall scores.
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Discord Link Button */}
            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80 hover:border-[#5865F2]/40 hover:bg-[#5865F2]/10 transition-all flex items-center justify-center text-zinc-400 hover:text-[#5865F2]"
              title="Join Our Discord"
            >
              <DiscordIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <RefreshCw className="w-10 h-10 text-purple-500 animate-spin mb-4" />
              <p className="text-zinc-500 font-mono text-sm tracking-wide">Retrieving official profiles...</p>
            </motion.div>
          ) : (
            (() => {
              const itemsPerPage = 10;
              const totalItems = data.length;
              const totalPages = Math.ceil(totalItems / itemsPerPage);
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const paginatedData = data.slice(startIndex, endIndex);

              return (
                <motion.div
                  key="leaderboard-table"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
                >
                  {totalItems === 0 ? (
                    <div className="py-24 px-8 text-center text-zinc-400 font-sans flex flex-col items-center justify-center animate-fade-in">
                      <div className="p-4 bg-purple-500/10 rounded-full text-purple-400 mb-5 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
                        <Trophy className="w-12 h-12" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">No Ranked Data Found</h3>
                      <p className="max-w-md text-sm text-zinc-500 leading-relaxed">
                        There are currently no active player promotions recorded for this gamemode.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                          <thead>
                            <tr className="border-b border-zinc-800/80 bg-zinc-900/50">
                              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold w-16 text-center">Rank</th>
                              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">User</th>
                              {activeTab === 'overall' ? (
                                <>
                                  <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold text-center">Title</th>
                                  <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold text-right">Overall Points</th>
                                </>
                              ) : (
                                <>
                                  <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold text-center">Highest Tier</th>
                                  <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold text-right">Elo Rating</th>
                                </>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedData.map((player, idx) => {
                              const rank = startIndex + idx + 1;
                              let rankStyle = "text-zinc-400 font-mono";
                              let rowBg = "border-l-3 border-transparent hover:bg-purple-500/5 transition-all duration-300";
                              let hoverBgColor = "rgba(168, 85, 247, 0.08)";
                              let hoverBorderColor = "rgba(168, 85, 247, 0.7)";
                              let hoverShadow = "0 8px 24px -4px rgba(168, 85, 247, 0.12), inset 0 0 16px 1px rgba(168, 85, 247, 0.04)";

                              if (rank === 1) {
                                rankStyle = "text-amber-100 font-extrabold bg-gradient-to-b from-amber-500/25 to-amber-600/10 rounded-lg py-1 px-3 border border-amber-400/60 text-center shadow-[0_0_16px_rgba(245,158,11,0.45)]";
                                rowBg = "bg-amber-500/5 border-l-3 border-amber-500 shadow-[inset_0_0_24px_rgba(245,158,11,0.04),0_0_20px_rgba(245,158,11,0.05)] transition-all duration-300";
                                hoverBgColor = "rgba(245, 158, 11, 0.12)";
                                hoverBorderColor = "rgba(245, 158, 11, 0.9)";
                                hoverShadow = "0 8px 28px -4px rgba(245, 158, 11, 0.20), inset 0 0 20px 1px rgba(245, 158, 11, 0.10)";
                              } else if (rank === 2) {
                                rankStyle = "text-zinc-50 font-bold bg-gradient-to-b from-zinc-400/25 to-zinc-500/10 rounded-lg py-1 px-3 border border-zinc-300/60 text-center shadow-[0_0_16px_rgba(168,168,168,0.35)]";
                                rowBg = "bg-zinc-500/4 border-l-3 border-zinc-400 shadow-[inset_0_0_20px_rgba(255,255,255,0.02),0_0_15px_rgba(168,168,168,0.03)] transition-all duration-300";
                                hoverBgColor = "rgba(161, 161, 170, 0.10)";
                                hoverBorderColor = "rgba(161, 161, 170, 0.8)";
                                hoverShadow = "0 8px 24px -4px rgba(161, 161, 170, 0.15), inset 0 0 18px 1px rgba(161, 161, 170, 0.08)";
                              } else if (rank === 3) {
                                rankStyle = "text-amber-200 font-bold bg-gradient-to-b from-amber-800/25 to-amber-900/10 rounded-lg py-1 px-3 border border-amber-700/60 text-center shadow-[0_0_16px_rgba(180,83,9,0.35)]";
                                rowBg = "bg-amber-800/4 border-l-3 border-amber-600 shadow-[inset_0_0_20px_rgba(180,83,9,0.01),0_0_15px_rgba(180,83,9,0.02)] transition-all duration-300";
                                hoverBgColor = "rgba(180, 83, 9, 0.10)";
                                hoverBorderColor = "rgba(180, 83, 9, 0.8)";
                                hoverShadow = "0 8px 24px -4px rgba(180, 83, 9, 0.15), inset 0 0 18px 1px rgba(180, 83, 9, 0.08)";
                              }

                              return (
                                <motion.tr
                                  key={player.discordId}
                                  onClick={() => handleInspectPlayer(player.username)}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  whileHover={{ 
                                    scale: 1.01, 
                                    x: 6,
                                    backgroundColor: hoverBgColor,
                                    borderLeftColor: hoverBorderColor,
                                    boxShadow: hoverShadow
                                  }}
                                  transition={{ 
                                      x: { type: "spring", stiffness: 350, damping: 25 },
                                      scale: { type: "spring", stiffness: 350, damping: 25 },
                                      backgroundColor: { duration: 0.2 },
                                      borderLeftColor: { duration: 0.2 },
                                      boxShadow: { duration: 0.2 },
                                      default: { delay: idx * 0.04 }
                                  }}
                                  className={`border-b border-zinc-900/60 ${rowBg} cursor-pointer origin-left`}
                                >
                                  {/* Rank Indicator */}
                                  <td className="py-4.5 px-6 text-center relative overflow-hidden">
                                    {rank === 1 && (
                                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-amber-500/15 rounded-full blur-md pointer-events-none" />
                                    )}
                                    {rank === 2 && (
                                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-zinc-350/10 rounded-full blur-md pointer-events-none" />
                                    )}
                                    {rank === 3 && (
                                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-amber-700/10 rounded-full blur-md pointer-events-none" />
                                    )}
                                    {rank === 1 && (
                                      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-amber-500/15 to-transparent pointer-events-none" />
                                    )}
                                    {rank === 2 && (
                                      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-zinc-400/10 to-transparent pointer-events-none" />
                                    )}
                                    {rank === 3 && (
                                      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-amber-700/10 to-transparent pointer-events-none" />
                                    )}
                                    <span className={`${rankStyle} relative z-10`}>{rank}</span>
                                  </td>

                                  {/* User details */}
                                  <td className="py-4.5 px-6">
                                    <div className="flex items-center gap-3">
                                      {/* 3D Isometric head avatar */}
                                      <div className="shrink-0 w-11 h-11">
                                        <img 
                                          src={`https://mc-heads.net/avatar/${player.username}/64.png`} 
                                          alt={`${player.username}'s 3D head`} 
                                          className="w-11 h-11 rounded-xl border border-zinc-800 bg-zinc-950 object-cover shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 relative z-10"
                                          onError={(e) => {
                                            e.currentTarget.src = `https://minotar.net/helm/${player.username}/64.png`;
                                          }}
                                          referrerPolicy="no-referrer"
                                        />
                                      </div>

                                      <div className="flex flex-col">
                                        <span className="font-semibold text-white tracking-wide hover:text-purple-400 transition-colors duration-150">{player.username}</span>
                                      </div>
                                    </div>
                                  </td>

                                  {activeTab === 'overall' ? (
                                    <>
                                      {/* Title Column */}
                                      <td className="py-4.5 px-6 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border ${getAchievementTitleStyles(player.totalPoints)}`}>
                                          {player.achievementTitle}
                                        </span>
                                      </td>

                                      {/* Points Column */}
                                      <td className="py-4.5 px-6 text-right font-mono text-zinc-150 font-semibold text-lg">
                                        <span className="text-purple-400">{player.totalPoints}</span> <span className="text-[10px] text-zinc-500 font-normal">PTS</span>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      {/* Highest Tier Badger using custom styled visual badge */}
                                      <td className="py-4.5 px-6 text-center">
                                        <TierBadge tier={player.tier} size="md" />
                                      </td>

                                      {/* Score Points */}
                                      <td className="py-4.5 px-6 text-right font-mono text-zinc-150 font-semibold text-lg">
                                        <span className="text-zinc-200">{player.points}</span> <span className="text-[10px] text-zinc-500 font-normal">PTS</span>
                                      </td>
                                    </>
                                  )}
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800/60 bg-zinc-950/40 px-6 py-4 rounded-b-2xl gap-4">
                          <div className="text-xs text-zinc-400 font-mono">
                            Showing <span className="text-purple-400 font-bold">{startIndex + 1}</span> to{' '}
                            <span className="text-purple-400 font-bold">{Math.min(endIndex, totalItems)}</span> of{' '}
                            <span className="text-white font-bold">{totalItems}</span> players
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-xs font-semibold"
                            >
                              Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                              <button
                                key={pNum}
                                onClick={() => setCurrentPage(pNum)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold leading-none font-mono transition-all cursor-pointer flex items-center justify-center ${
                                  currentPage === pNum
                                    ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.25)] border border-purple-500'
                                    : 'bg-zinc-950/20 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
                                }`}
                              >
                                {pNum}
                              </button>
                            ))}

                            <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-xs font-semibold"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })()
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Discord Bot Developer & Simulator Hub Modal */}
      <AnimatePresence>
        {showBotHubModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBotHubModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-4xl bg-[#0a0e1a] border border-zinc-800/80 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[92vh] overflow-y-auto z-10 select-none custom-scroll"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowBotHubModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900/60 hover:bg-zinc-850 hover:text-white text-zinc-400 border border-zinc-850/60 transition-all cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Branding Header */}
              <div className="flex flex-col gap-1 mb-6 pb-4 border-b border-zinc-900/85">
                <div className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-purple-400" />
                  <span className="font-display font-black text-lg md:text-xl text-white tracking-tight uppercase">SlamTiers Bot Developer Hub</span>
                </div>
                <p className="text-zinc-400 font-sans text-xs">
                  Connect your discord bot to dynamically synchronize and publish tournament/combat rankings on this leaderboard in real-time.
                </p>
              </div>

              {/* Grid: Left setup block, Right sandbox simulator */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: Setup details (span 7) */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold font-mono text-purple-300 uppercase tracking-widest">
                    <Code className="w-3.5 h-3.5 text-purple-400" />
                    <span>Bot REST API Credentials</span>
                  </div>

                  {/* REST URL Input Group */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block text-left">
                      API Entry Route (POST)
                    </label>
                    <div className="flex items-stretch p-1 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/api/promote`}
                        className="flex-grow pl-3 text-xs font-mono text-zinc-300 bg-transparent select-all outline-none"
                      />
                      <button
                        onClick={copyEndpoint}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer flex items-center gap-1.5 border border-zinc-800 shrink-0"
                      >
                        {copiedEndpoint ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedEndpoint ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Secret Token Group */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block text-left">
                      Authorization Bearer Token
                    </label>
                    <div className="flex items-stretch p-1 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                      <input
                        type="password"
                        readOnly
                        value="A@V>Wr]qs~_,?6E#*L9)2=4dXxc4PNdE"
                        className="flex-grow pl-3 text-xs font-mono text-zinc-400 bg-transparent select-all outline-none"
                      />
                      <button
                        onClick={copyToken}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer flex items-center gap-1.5 border border-zinc-800 shrink-0"
                      >
                        {copiedToken ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 block text-left">Matches credentials configured inside the active server instance.</span>
                  </div>

                  {/* REST Boilerplate Scripts tab and snippet */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
                        Quick Integration Snippet
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setBotLanguage('node')}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold transition-all ${
                            botLanguage === 'node' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/35' : 'text-zinc-500 hover:text-zinc-350'
                          }`}
                        >
                          NodeJS
                        </button>
                        <button
                          onClick={() => setBotLanguage('python')}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold transition-all ${
                            botLanguage === 'python' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/35' : 'text-zinc-500 hover:text-zinc-350'
                          }`}
                        >
                          Python
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-950/90 border border-zinc-900 rounded-xl overflow-x-auto text-[10.5px] font-mono text-zinc-300 select-all max-h-[175px] custom-scroll leading-relaxed text-left">
                      {botLanguage === 'node' ? (
                        <pre>{`// Discord.js event receiver boilerplate
const response = await fetch(\`${window.location.origin}/api/promote\`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer A@V>Wr]qs~_,?6E#*L9)2=4dXxc4PNdE'
  },
  body: JSON.stringify({
    discordId: "731320713892742918",
    username: "Steve", 
    gamemode: "sword", // sword, mace, diapot etc
    tier: "HT2",       // HT1 to LT5
    points: 30
  })
});

const data = await response.json();
console.log('Update result:', data.success);`}</pre>
                      ) : (
                        <pre>{`# discord.py client task boilerplate
import requests

url = "${window.location.origin}/api/promote"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer A@V>Wr]qs~_,?6E#*L9)2=4dXxc4PNdE"
}
payload = {
    "discordId": "731320713892742918",
    "username": "Steve",
    "gamemode": "sword",
    "tier": "HT2",
    "points": 30
}

r = requests.post(url, json=payload, headers=headers)
print("Synchronization result:", r.json())`}</pre>
                      )}
                    </div>
                  </div>

                  {/* Schema Info */}
                  <div className="p-3 bg-zinc-950/30 border border-zinc-900/60 rounded-xl text-left">
                    <h5 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-zinc-450" />
                      <span>Validation Requirements</span>
                    </h5>
                    <ul className="text-[10.5px] text-zinc-400 space-y-1 list-disc pl-3.5 leading-relaxed">
                      <li><span className="font-semibold text-zinc-300">discordId:</span> Valid Discord User Snowflake identifier string.</li>
                      <li><span className="font-semibold text-zinc-300">username:</span> Player Minecraft IGN case-sensitive name.</li>
                      <li><span className="font-semibold text-zinc-300">gamemode:</span> sword, mace, diapot, nethpot, smp, builduhc, axe, crystal.</li>
                      <li><span className="font-semibold text-zinc-300">tier:</span> HT1, LT1, HT2, LT2, HT3, LT3, HT4, LT4, HT5, LT5.</li>
                    </ul>
                  </div>
                </div>

                {/* RIGHT COLUMN: Simulator Form (span 5) */}
                <div className="lg:col-span-5 bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl md:rounded-3xl relative">
                  <div className="flex items-center gap-2 mb-4 text-xs font-bold font-mono text-purple-300 uppercase tracking-widest">
                    <Terminal className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    <span>Live Bot Sandbox Test</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-normal mb-4 text-left">
                    Send a test payload to proof-verify the express backend routing. The record updates Firestore dynamically!
                  </p>

                  <form onSubmit={handleSimulateBotRequest} className="space-y-4">
                    
                    {/* Minecraft IGN Input */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block text-left">Minecraft Username</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Steve"
                        value={simUsername}
                        onChange={(e) => setSimUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 focus:border-purple-600/80 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    {/* Discord Snowflake ID Input */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block text-left">Discord User Snowflake ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 731320713892742918"
                        value={simDiscordId}
                        onChange={(e) => setSimDiscordId(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 focus:border-purple-600/80 rounded-xl text-xs text-white outline-none font-mono"
                      />
                    </div>

                    {/* Two Columns: gamemode and Tier */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block text-left">Gamemode</label>
                        <select
                          value={simGamemode}
                          onChange={(e) => setSimGamemode(e.target.value)}
                          className="w-full px-2 py-2 bg-zinc-950 border border-zinc-900 focus:border-purple-600/80 rounded-xl text-xs text-white outline-none"
                        >
                          <option value="sword">Sword</option>
                          <option value="mace">Mace</option>
                          <option value="diapot">Diamond Pot</option>
                          <option value="nethpot">Netherite Pot</option>
                          <option value="smp">SMP</option>
                          <option value="builduhc">Build UHC</option>
                          <option value="axe">Axe</option>
                          <option value="crystal">Crystal</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block text-left">Tier</label>
                        <select
                          value={simTier}
                          onChange={(e) => {
                            const selectedTier = e.target.value;
                            setSimTier(selectedTier);
                            // Auto map correct points helper
                            const pointsMap: Record<string, string> = {
                              'HT1': '60', 'LT1': '40',
                              'HT2': '30', 'LT2': '25',
                              'HT3': '20', 'LT3': '15',
                              'HT4': '12', 'LT4': '8',
                              'HT5': '5',  'LT5': '2'
                            };
                            setSimPoints(pointsMap[selectedTier] || '0');
                          }}
                          className="w-full px-2 py-2 bg-zinc-950 border border-zinc-900 focus:border-purple-600/80 rounded-xl text-xs text-white outline-none"
                        >
                          <option value="HT1">HT1</option>
                          <option value="LT1">LT1</option>
                          <option value="HT2">HT2</option>
                          <option value="LT2">LT2</option>
                          <option value="HT3">HT3</option>
                          <option value="LT3">LT3</option>
                          <option value="HT4">HT4</option>
                          <option value="LT4">LT4</option>
                          <option value="HT5">HT5</option>
                          <option value="LT5">LT5</option>
                        </select>
                      </div>
                    </div>

                    {/* Numeric Points Input */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center bg-transparent">
                        <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block text-left">XP Points Contributed</label>
                        <span className="text-[9px] font-mono text-purple-400">Mapped: {simPoints} PTS</span>
                      </div>
                      <input
                        type="number"
                        required
                        value={simPoints}
                        onChange={(e) => setSimPoints(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 focus:border-purple-600/80 rounded-xl text-xs text-white outline-none font-mono text-left"
                      />
                    </div>

                    {/* Feedback Messages */}
                    {simSuccess && (
                      <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/40 text-green-400 text-xs font-mono select-text flex flex-col gap-1 text-left">
                        <span className="font-bold text-green-300">✓ TEST SUCCESS</span>
                        <span>{simSuccess}</span>
                      </div>
                    )}

                    {simError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono select-text flex flex-col gap-1 text-left">
                        <span className="font-bold text-red-300">⚠ TEST FAILED</span>
                        <span>{simError}</span>
                      </div>
                    )}

                    {/* Sandbox Submit Button */}
                    <button
                      type="submit"
                      disabled={simLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-550 hover:to-indigo-550 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {simLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching POST Payload...</span>
                        </>
                      ) : (
                        <>
                          <Terminal className="w-3.5 h-3.5" />
                          <span>⚡ Dispatch Simulated Bot Request</span>
                        </>
                      )}
                    </button>

                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
