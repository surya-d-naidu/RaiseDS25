import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, User, Mail, Building, MapPin, FileText, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
// @ts-ignore - html2canvas provides its own types
import html2canvas from 'html2canvas';

interface ConferenceIdCardProps {
  className?: string;
}

export default function ConferenceIdCard({ className }: ConferenceIdCardProps) {
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch user profile data
  const { data: profile } = useQuery<any>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  // Fetch user's abstracts
  const { data: abstracts } = useQuery<any[]>({
    queryKey: ["/api/abstracts"],
    enabled: !!user,
  });

  const downloadIdCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `RAISE-DS-2025-ID-Card-${user?.firstName}-${user?.lastName}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating ID card:', error);
    }
  };

  if (!user) {
    return null;
  }

  const userRole = user.role === 'admin' ? 'COMMITTEE MEMBER' : 'PARTICIPANT';
  const hasAbstract = abstracts && abstracts.length > 0;
  const primaryAbstract = hasAbstract ? abstracts[0] : null;
  
  // Determine role badge based on abstract status and user role
  const getRoleBadge = () => {
    if (user.role === 'admin') {
      return { text: 'COMMITTEE', color: 'bg-purple-500 text-white' };
    }
    if (primaryAbstract?.status === 'accepted') {
      return { text: 'PRESENTER', color: 'bg-green-500 text-white' };
    }
    if (hasAbstract) {
      return { text: 'AUTHOR', color: 'bg-blue-500 text-white' };
    }
    return { text: 'PARTICIPANT', color: 'bg-gray-500 text-white' };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className={className}>
      <div className="flex flex-col items-center space-y-4">
        {/* Download Button */}
        <Button onClick={downloadIdCard} className="mb-4">
          <Download className="w-4 h-4 mr-2" />
          Download ID Card
        </Button>

        {/* ID Card */}
        <div 
          ref={cardRef}
          className="w-[400px] h-[600px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-2xl overflow-hidden relative"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-sm p-4 text-center border-b border-white/20">
            <div className="flex justify-center items-center space-x-4 mb-2">
              <img 
                src="/Temps/VIT-AP_University_seal.png" 
                alt="VIT-AP" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-white">RAISE DS</h1>
                <p className="text-sm text-blue-100">2025</p>
              </div>
              <img 
                src="/Temps/ISPS-LOGO-622x622.png" 
                alt="ISPS" 
                className="h-12 w-12 object-contain"
              />
            </div>
            <p className="text-xs text-blue-100 leading-tight">
              45th Annual Convention ISPS<br />
              Recent Advances in Data Science
            </p>
          </div>

          {/* Profile Section */}
          <div className="p-6 text-center">
            {/* Profile Picture */}
            <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-white/20 border-4 border-white flex items-center justify-center">
              {user.profilePictureUrl || profile?.profilePictureUrl ? (
                <img 
                  src={user.profilePictureUrl || profile?.profilePictureUrl} 
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white/70" />
              )}
            </div>

            {/* Role Badge */}
            <Badge className={`${roleBadge.color} mb-3 px-3 py-1 text-xs font-semibold`}>
              {roleBadge.text}
            </Badge>

            {/* Name */}
            <h2 className="text-xl font-bold text-white mb-1">
              {user.firstName} {user.lastName}
            </h2>

            {/* Institution */}
            <p className="text-blue-100 text-sm mb-4 flex items-center justify-center">
              <Building className="w-4 h-4 mr-1" />
              {user.institution}
            </p>
          </div>

          {/* Accent Line */}
          <div className="mx-6 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-4"></div>

          {/* Details Section */}
          <div className="px-6 space-y-3 text-white">
            {/* Email */}
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-3 text-blue-200" />
              <span className="text-blue-100 text-xs break-all">{user.email}</span>
            </div>

            {/* Position/Department */}
            {profile?.position && (
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-3 text-blue-200" />
                <span className="text-blue-100 text-xs">{profile.position}</span>
              </div>
            )}

            {/* Country */}
            {profile?.country && (
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-3 text-blue-200" />
                <span className="text-blue-100 text-xs">{profile.country}</span>
              </div>
            )}

            {/* Abstract Info */}
            {primaryAbstract && (
              <div className="flex items-start text-sm">
                <FileText className="w-4 h-4 mr-3 mt-0.5 text-blue-200 flex-shrink-0" />
                <div className="text-blue-100 text-xs">
                  <p className="font-medium">{primaryAbstract.category}</p>
                  <p className="opacity-80 line-clamp-2">{primaryAbstract.title}</p>
                </div>
              </div>
            )}

            {/* Conference Dates */}
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-3 text-blue-200" />
              <span className="text-blue-100 text-xs">Dec 22-24, 2025</span>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm p-3 text-center">
            {/* QR Code Placeholder */}
            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded border-2 border-gray-300 flex items-center justify-center">
              <div className="w-8 h-8 bg-black/80 rounded-sm">
                <div className="grid grid-cols-3 gap-px p-1 h-full">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-200">
              ID: RDS2025-{user.role === 'admin' ? 'C' : 'P'}-{String(user.id).padStart(4, '0')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
