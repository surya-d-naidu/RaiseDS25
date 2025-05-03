import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import CountdownTimer from "@/components/ui/countdown-timer";
import StatisticalBackground from "@/components/ui/statistical-background";

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
              <p className="mt-3 text-base text-gray-700 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)
              </p>
              <p className="mt-2 text-base text-primary-800 font-semibold sm:mt-3 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-3 md:text-xl lg:mx-0">
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
        <div className="h-72 w-full sm:h-80 md:h-[400px] lg:w-full lg:h-full bg-[#14171f] overflow-hidden border-l-2 border-primary/20">
          <StatisticalBackground />
        </div>
      </div>
    </div>
  );
}
