"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Compass,
  Bot,
  Bookmark,
  ShieldCheck,
  Key,
  Menu,
  X,
  Sparkles,
  BarChart3,
  PhoneCall,
} from "lucide-react";
import { GitHubAccessModal } from "./GitHubAccessModal";
import { FeedbackModal } from "./FeedbackModal";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Calculator", icon: Activity, badge: "30s Flow" },
    { href: "/wayfinder", label: "Wayfinder", icon: Compass, badge: "10 Tickets" },
    { href: "/agents", label: "Agents Swarm", icon: Bot, badge: "6 Agents" },
    { href: "/explorer", label: "NBA Roster", icon: BarChart3 },
    { href: "/snapshots", label: "Snapshots", icon: Bookmark },
    { href: "/compliance", label: "Compliance & 21+", icon: ShieldCheck },
  ];

  return (
    <>
      {/* Top Responsible Gaming & Beta Notice Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              21+ ONLY
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Analysis-Only Beta · Zero Wagering · Strictly Descriptive Evidence
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Feedback</span>
            </button>
            <a
              href="tel:1-800-426-2537"
              className="text-slate-400 hover:text-amber-400 transition-colors flex items-center space-x-1"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span className="hidden xs:inline">1-800-GAMBLER</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                  E
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-slate-100 tracking-tight text-base sm:text-lg">
                      Edge Calculator
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded">
                      V1 Beta
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 -mt-1 font-medium hidden xs:block">
                    NBA Player-Prop Historical Evidence
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-slate-800 text-sky-400 border border-slate-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                        isActive ? "bg-sky-500/20 text-sky-300" : "bg-slate-800 text-slate-400"
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsGitHubModalOpen(true)}
                className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 px-3 py-2 rounded-xl border border-slate-700 transition-colors shadow-sm"
              >
                <Key className="w-3.5 h-3.5" />
                <span>GitHub & Vercel</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-5 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsGitHubModalOpen(true);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30"
              >
                <Key className="w-4 h-4" />
                <span>Generate GitHub Keys & Vercel Setup</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* GitHub & Feedback Modals */}
      <GitHubAccessModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
}
