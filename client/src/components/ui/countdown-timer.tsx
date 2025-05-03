import { useState, useEffect } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Target date is in the past
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Initial calculation
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Cleanup
    return () => clearInterval(timer);
  }, [targetDate]);

  // Format digits to always have 2 digits
  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Conference Starts In:</p>
      <div className="flex space-x-3 sm:space-x-5">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-b from-white to-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center shadow-md border border-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 rounded-lg"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
            <span className="text-2xl sm:text-3xl font-bold text-primary relative">{formatNumber(timeLeft.days)}</span>
          </div>
          <span className="text-xs mt-2 font-semibold text-gray-700">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-b from-white to-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center shadow-md border border-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 rounded-lg"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
            <span className="text-2xl sm:text-3xl font-bold text-primary relative animate-pulse">{formatNumber(timeLeft.hours)}</span>
          </div>
          <span className="text-xs mt-2 font-semibold text-gray-700">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-b from-white to-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center shadow-md border border-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 rounded-lg"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
            <span className="text-2xl sm:text-3xl font-bold text-primary relative">{formatNumber(timeLeft.minutes)}</span>
          </div>
          <span className="text-xs mt-2 font-semibold text-gray-700">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-b from-white to-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center shadow-md border border-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 rounded-lg"></div>
            <div 
              className="absolute bottom-0 left-0 h-1 bg-primary"
              style={{ 
                width: `${(timeLeft.seconds / 60) * 100}%`,
                transition: 'width 1s linear'
              }}
            ></div>
            <span className="text-2xl sm:text-3xl font-bold text-primary relative">{formatNumber(timeLeft.seconds)}</span>
          </div>
          <span className="text-xs mt-2 font-semibold text-gray-700">Seconds</span>
        </div>
      </div>
    </div>
  );
}