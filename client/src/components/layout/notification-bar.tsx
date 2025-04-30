import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Info, X, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "@shared/schema";

export default function NotificationBar() {
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const activeNotifications = notifications.filter(n => n.isActive);

  useEffect(() => {
    if (activeNotifications.length > 1) {
      const interval = setInterval(() => {
        setCurrentNotificationIndex((prevIndex) => 
          (prevIndex + 1) % activeNotifications.length
        );
      }, 8000); // Rotate every 8 seconds
      
      return () => clearInterval(interval);
    }
  }, [activeNotifications.length]);

  if (!visible || activeNotifications.length === 0) {
    return null;
  }

  const currentNotification = activeNotifications[currentNotificationIndex];
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="h-5 w-5 mr-2 flex-shrink-0" />;
      case 'important':
        return <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />;
      default:
        return <Info className="h-5 w-5 mr-2 flex-shrink-0" />;
    }
  };
  
  const getBgColor = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'bg-amber-600';
      case 'important':
        return 'bg-red-600';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={cn("text-white px-4 py-3", getBgColor(currentNotification.type))}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {getIcon(currentNotification.type)}
          <span className="font-medium">{currentNotification.title}: {currentNotification.content}</span>
        </div>
        <div className="flex items-center">
          {activeNotifications.length > 1 && (
            <div className="flex space-x-1 mr-3">
              {activeNotifications.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentNotificationIndex(index)}
                  className={`h-2 w-2 rounded-full ${
                    index === currentNotificationIndex ? "bg-white" : "bg-white/30"
                  }`}
                  aria-label={`Go to notification ${index + 1}`}
                />
              ))}
            </div>
          )}
          <button 
            onClick={() => setVisible(false)} 
            className="focus:outline-none"
            aria-label="Close notification"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
