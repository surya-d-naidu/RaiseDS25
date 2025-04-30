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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <div className="h-8 w-8 bg-primary rounded flex items-center justify-center mr-2">
                    <BarChart2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-semibold text-gray-800">RAISE DS</span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/") 
                    ? "border-primary text-gray-900" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Home
                </a>
              </Link>
              <Link href="/about">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/about") 
                    ? "border-primary text-gray-900" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  About
                </a>
              </Link>
              <Link href="/call-for-papers">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/call-for-papers") 
                    ? "border-primary text-gray-900" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Call for Papers
                </a>
              </Link>
              <Link href="/research-awards">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/research-awards") 
                    ? "border-primary text-gray-900" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Research Awards
                </a>
              </Link>
              <Link href="/committee">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/committee") 
                    ? "border-primary text-gray-900" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Committee
                </a>
              </Link>
              <Link href="/register">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/register") 
                    ? "border-primary text-gray-900" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Register
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User size={18} />
                    <span>{user.firstName}</span>
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
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <a className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/") 
                ? "bg-primary-50 border-primary text-primary-700" 
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}>
              Home
            </a>
          </Link>
          <Link href="/about">
            <a className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/about") 
                ? "bg-primary-50 border-primary text-primary-700" 
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}>
              About
            </a>
          </Link>
          <Link href="/call-for-papers">
            <a className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/call-for-papers") 
                ? "bg-primary-50 border-primary text-primary-700" 
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}>
              Call for Papers
            </a>
          </Link>
          <Link href="/research-awards">
            <a className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/research-awards") 
                ? "bg-primary-50 border-primary text-primary-700" 
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}>
              Research Awards
            </a>
          </Link>
          <Link href="/committee">
            <a className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/committee") 
                ? "bg-primary-50 border-primary text-primary-700" 
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}>
              Committee
            </a>
          </Link>
          <Link href="/register">
            <a className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/register") 
                ? "bg-primary-50 border-primary text-primary-700" 
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}>
              Register
            </a>
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="space-y-1">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-800 truncate">{user.username}</p>
              </div>
              <Link href="/profile">
                <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Profile
                </a>
              </Link>
              <Link href="/abstracts/submit">
                <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Submit Abstract
                </a>
              </Link>
              {user.role === "admin" && (
                <Link href="/admin">
                  <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Admin Dashboard
                  </a>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="px-4">
              <Link href="/auth">
                <Button className="w-full">Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
