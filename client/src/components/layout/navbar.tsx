import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart2,
  Menu,
  User,
  LogOut,
  ChevronDown,
  FileText,
  Settings,
  ChevronRight
} from "lucide-react";
import { getImageWithFallback } from "@/lib/asset-utils";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">              <Link href="/">
                <div className="flex items-center cursor-pointer group">
                  <img 
                    {...getImageWithFallback('logo.jpeg', 'logo.png')}
                    alt="RAISE DS Logo" 
                    className="h-12 w-auto mr-3 rounded-md shadow-sm transform transition-all duration-300 group-hover:scale-105 border border-white/20" 
                  />
                  <span className="text-xl font-bold tracking-tight text-white group-hover:text-white/90">RAISE DS 2025</span>
                </div>
              </Link>
            </div>
            <div className="hidden md:ml-8 md:flex md:items-center md:space-x-6 lg:space-x-8">
              <Link href="/">
                <a className={`inline-flex items-center px-2 py-2 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  isActive("/") 
                    ? "border-white text-white font-bold" 
                    : "border-transparent text-white/90 hover:border-white/70 hover:text-white"
                }`}>
                  Home
                </a>
              </Link>
              <Link href="/about">
                <a className={`inline-flex items-center px-2 py-2 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  isActive("/about") 
                    ? "border-white text-white font-bold" 
                    : "border-transparent text-white/90 hover:border-white/70 hover:text-white"
                }`}>
                  About
                </a>
              </Link>
              <Link href="/call-for-papers">
                <a className={`inline-flex items-center px-2 py-2 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  isActive("/call-for-papers") 
                    ? "border-white text-white font-bold" 
                    : "border-transparent text-white/90 hover:border-white/70 hover:text-white"
                }`}>
                  Papers
                </a>
              </Link>
              <Link href="/research-awards">
                <a className={`inline-flex items-center px-2 py-2 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  isActive("/research-awards") 
                    ? "border-white text-white font-bold" 
                    : "border-transparent text-white/90 hover:border-white/70 hover:text-white"
                }`}>
                  Awards
                </a>
              </Link>
              <Link href="/committee">
                <a className={`inline-flex items-center px-2 py-2 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  isActive("/committee") 
                    ? "border-white text-white font-bold" 
                    : "border-transparent text-white/90 hover:border-white/70 hover:text-white"
                }`}>
                  Committee
                </a>
              </Link>
              <Link href="/register">
                <a className={`inline-flex items-center px-2 py-2 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  isActive("/register") 
                    ? "border-white text-white font-bold" 
                    : "border-transparent text-white/90 hover:border-white/70 hover:text-white"
                }`}>
                  Register
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-primary-800/50 px-4">
                    <User size={18} />
                    <span className="font-medium">{user.firstName}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/abstracts/submit">
                    <DropdownMenuItem className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Submit Abstract</span>
                    </DropdownMenuItem>
                  </Link>
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin</DropdownMenuLabel>
                      <Link href="/admin">
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button className="ml-4 font-medium">Sign In</Button>
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              className="text-white hover:bg-primary-800/50"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-primary/95 text-white shadow-lg`}>
        <div className="pt-2 pb-1">
          <div className="flex items-center justify-center px-4 py-2">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img 
                  src="/logo.jpeg" 
                  alt="RAISE DS Logo" 
                  className="h-10 w-auto mr-2 rounded shadow-sm" 
                />
                <span className="text-lg font-bold tracking-tight text-white">RAISE DS 2025</span>
              </div>
            </Link>          </div>
        </div>
        <div className="border-t border-white/10 pt-2">
          <Link href="/">
            <a className={`block pl-4 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-150 ${
              isActive("/") 
                ? "bg-primary-700/30 border-white text-white font-bold" 
                : "border-transparent text-white/90 hover:bg-primary-800/20 hover:border-white/60 hover:text-white"
            }`}>
              Home
            </a>
          </Link>
          <Link href="/about">
            <a className={`block pl-4 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-150 ${
              isActive("/about") 
                ? "bg-primary-700/30 border-white text-white font-bold" 
                : "border-transparent text-white/90 hover:bg-primary-800/20 hover:border-white/60 hover:text-white"
            }`}>
              About
            </a>
          </Link>
          <Link href="/call-for-papers">
            <a className={`block pl-4 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-150 ${
              isActive("/call-for-papers") 
                ? "bg-primary-700/30 border-white text-white font-bold" 
                : "border-transparent text-white/90 hover:bg-primary-800/20 hover:border-white/60 hover:text-white"
            }`}>
              Call for Papers
            </a>
          </Link>
          <Link href="/research-awards">
            <a className={`block pl-4 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-150 ${
              isActive("/research-awards") 
                ? "bg-primary-700/30 border-white text-white font-bold" 
                : "border-transparent text-white/90 hover:bg-primary-800/20 hover:border-white/60 hover:text-white"
            }`}>
              Research Awards
            </a>
          </Link>
          <Link href="/committee">
            <a className={`block pl-4 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-150 ${
              isActive("/committee") 
                ? "bg-primary-700/30 border-white text-white font-bold" 
                : "border-transparent text-white/90 hover:bg-primary-800/20 hover:border-white/60 hover:text-white"
            }`}>
              Committee
            </a>
          </Link>
          <Link href="/register">
            <a className={`block pl-4 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-150 ${
              isActive("/register") 
                ? "bg-primary-700/30 border-white text-white font-bold" 
                : "border-transparent text-white/90 hover:bg-primary-800/20 hover:border-white/60 hover:text-white"
            }`}>
              Register
            </a>
          </Link>
        </div>        <div className="pt-4 pb-4 border-t border-white/20">
          {user ? (
            <div className="space-y-0.5">
              <div className="px-4 py-3 flex items-center space-x-3 bg-primary-800/20">                <img src="/logo.jpeg" alt="RAISE DS Logo" className="h-8 w-auto rounded shadow-sm animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-white/70">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">{user.username}</p>
                </div>
              </div>
              <Link href="/profile">
                <a className="block px-4 py-2.5 text-base font-medium text-white/90 hover:text-white hover:bg-primary-800/30 transition-colors duration-150">
                  Profile
                </a>
              </Link>
              <Link href="/abstracts/submit">
                <a className="block px-4 py-2.5 text-base font-medium text-white/90 hover:text-white hover:bg-primary-800/30 transition-colors duration-150">
                  Submit Abstract
                </a>
              </Link>
              {user.role === "admin" && (
                <Link href="/admin">
                  <a className="block px-4 py-2.5 text-base font-medium text-white/90 hover:text-white hover:bg-primary-800/30 transition-colors duration-150">
                    Admin Dashboard
                  </a>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2.5 text-base font-medium text-white/90 hover:text-white hover:bg-primary-800/30 transition-colors duration-150"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="px-4 py-3">
              <Link href="/auth">
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-medium">Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
