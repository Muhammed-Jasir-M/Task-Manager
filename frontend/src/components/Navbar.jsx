import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, CheckCircle2, Home, User, PlusCircle } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isClerkActive = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  const desktopNavLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Manage', path: '/manage', icon: Settings },
  ];

  const mobileNavLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create', path: '/create', icon: PlusCircle },
    { name: 'Manage', path: '/manage', icon: Settings },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Branding */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  TaskLite
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              {desktopNavLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active 
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <div className="h-5 w-px bg-slate-800 mx-2"></div>

              {/* Clerk User Profile or Auth Action */}
              {isClerkActive ? (
                <>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all duration-200">
                        <User className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Sign In</span>
                      </button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <div className="flex items-center ml-1">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: 'w-9 h-9 rounded-xl ring-2 ring-indigo-500/40'
                          }
                        }}
                      />
                    </div>
                  </SignedIn>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md shadow-indigo-500/25 transition-all duration-200"
                >
                  <span>Launch App</span>
                </Link>
              )}
            </div>

            {/* Mobile Top Header Action (Clerk User Avatar / Sign In) */}
            <div className="flex md:hidden items-center space-x-2">
              {isClerkActive ? (
                <>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md">
                        <User className="h-3.5 w-3.5 text-indigo-200" />
                        <span>Sign In</span>
                      </button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: 'w-8 h-8 rounded-lg ring-1 ring-indigo-500/40'
                        }
                      }}
                    />
                  </SignedIn>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md"
                >
                  Launch App
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex justify-around items-center shadow-2xl shadow-slate-950">
        {mobileNavLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : ''}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;