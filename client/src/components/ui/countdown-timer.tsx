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
      <p className="text-sm font-medium text-gray-600 mb-2">Conference Starts In:</p>
      <div className="flex space-x-3 sm:space-x-4">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-2xl sm:text-3xl font-bold text-primary-700">{formatNumber(timeLeft.days)}</span>
          </div>
          <span className="text-xs mt-1 font-medium text-gray-500">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-2xl sm:text-3xl font-bold text-primary-700">{formatNumber(timeLeft.hours)}</span>
          </div>
          <span className="text-xs mt-1 font-medium text-gray-500">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-2xl sm:text-3xl font-bold text-primary-700">{formatNumber(timeLeft.minutes)}</span>
          </div>
          <span className="text-xs mt-1 font-medium text-gray-500">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-2xl sm:text-3xl font-bold text-primary-700">{formatNumber(timeLeft.seconds)}</span>
          </div>
          <span className="text-xs mt-1 font-medium text-gray-500">Seconds</span>
        </div>
      </div>
    </div>
  );
}