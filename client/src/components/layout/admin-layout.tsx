import { useState, ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Helmet } from "react-helmet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Bell,
  Settings,
  Award,
  ChevronRight,
  Menu,
} from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
  description?: string;
};

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin area.</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Abstracts",
      href: "/admin/abstracts",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Awards",
      href: "/admin/awards",
      icon: <Award className="h-5 w-5" />,
    },
    {
      name: "Invitations",
      href: "/admin/invitations",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      name: "Notifications",
      href: "/admin/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      <Helmet>
        <title>{title} | Admin | RAISE DS 2025</title>
        <meta name="description" content={description || `Admin ${title} page for RAISE DS 2025 conference`} />
      </Helmet>
      
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-gray-500">
                  {description}
                </p>
              )}
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <div className="md:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[250px] p-0">
                    <div className="py-6 px-4">
                      <h2 className="text-lg font-semibold text-gray-900">Admin Menu</h2>
                    </div>
                    <Separator />
                    <nav className="py-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          <a
                            className={`flex items-center px-4 py-3 text-sm font-medium ${
                              isActive(item.href)
                                ? "bg-gray-100 text-primary"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {item.icon}
                            <span className="ml-3">{item.name}</span>
                            {isActive(item.href) && (
                              <ChevronRight className="ml-auto h-4 w-4" />
                            )}
                          </a>
                        </Link>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="md:col-span-1 hidden md:block">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive(item.href)
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </a>
                  </Link>
                ))}
              </nav>
              
              <Separator className="my-6" />
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Admin Actions</h3>
                <div className="mt-2 space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Site Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Award className="mr-2 h-4 w-4" />
                    Research Awards
                  </Button>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  Admin access allows you to manage all aspects of the conference.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-3 lg:col-span-4">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
