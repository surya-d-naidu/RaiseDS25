import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import CountdownTimer from "@/components/ui/countdown-timer";

export default function HeroSection() {
  const { user } = useAuth();
  
  // Conference date: December 22-24, 2025
  const conferenceDate = new Date("December 22, 2025 09:00:00");

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg 
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" 
            fill="currentColor" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">45th Annual Convention of</span>{" "}
                <span className="block text-primary xl:inline">ISPS 2025</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)
              </p>
              <p className="mt-2 text-base text-gray-700 font-semibold sm:mt-3 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-3 md:text-xl lg:mx-0">
                December 22-24, 2025 | VIT-AP University, Vijayawada
              </p>
              
              <div className="mt-6 mb-8 sm:mt-8 sm:mb-10 max-w-xl sm:mx-auto lg:mx-0">
                <CountdownTimer targetDate={conferenceDate} />
              </div>
              
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/register">
                    <Button size="lg" className="w-full">
                      Register Now
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="/api/brochure" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="w-full">
                      Download Brochure
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <svg
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          viewBox="0 0 1200 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="1200" height="800" fill="#0f172a" />
          <g fill="#3b82f6" fillOpacity="0.5">
            {/* Grid pattern */}
            {Array.from({ length: 100 }).map((_, i) => (
              <rect 
                key={i} 
                x={Math.random() * 1200} 
                y={Math.random() * 800} 
                width={Math.random() * 30 + 5} 
                height={Math.random() * 30 + 5} 
                opacity={Math.random() * 0.5 + 0.1}
              />
            ))}
            
            {/* Data points */}
            {Array.from({ length: 50 }).map((_, i) => (
              <circle 
                key={`point-${i}`} 
                cx={Math.random() * 1200} 
                cy={Math.random() * 800} 
                r={Math.random() * 4 + 2} 
                opacity={Math.random() * 0.8 + 0.2}
                fill="#60a5fa"
              />
            ))}
            
            {/* Lines connecting points */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line 
                key={`line-${i}`} 
                x1={Math.random() * 1200} 
                y1={Math.random() * 800} 
                x2={Math.random() * 1200} 
                y2={Math.random() * 800} 
                stroke="#93c5fd"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}
            
            {/* Chart bars */}
            {Array.from({ length: 8 }).map((_, i) => {
              const x = 150 + i * 120;
              const height = Math.random() * 200 + 100;
              return (
                <rect 
                  key={`bar-${i}`} 
                  x={x} 
                  y={600 - height} 
                  width="80" 
                  height={height} 
                  fill="#60a5fa"
                  opacity="0.7"
                />
              )
            })}
            
            {/* Data curve */}
            <path 
              d="M100,600 Q300,200 500,400 T900,300" 
              stroke="#dbeafe" 
              strokeWidth="4" 
              fill="none" 
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
