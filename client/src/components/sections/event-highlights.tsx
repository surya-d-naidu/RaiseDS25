import { 
  ClipboardList, 
  Clock, 
  Lightbulb, 
  BarChart 
} from "lucide-react";
import { Link } from "wouter";

const highlights = [
  {
    icon: <ClipboardList className="w-16 h-16 text-primary" />,
    title: "45th",
    description: "Annual Convention",
    bgColor: "bg-primary-50",
    link: "/about"
  },
  {
    icon: <Clock className="w-16 h-16 text-secondary" />,
    title: "3",
    description: "Conference Days",
    bgColor: "bg-secondary-50",
    link: "/about"
  },
  {
    icon: <Lightbulb className="w-16 h-16 text-blue-500" />,
    title: "1",
    description: "Workshop Day",
    bgColor: "bg-blue-50",
    link: "/about"
  },
  {
    icon: <BarChart className="w-16 h-16 text-green-500" />,
    title: "20+",
    description: "Research Themes",
    bgColor: "bg-green-50",
    link: "/call-for-papers#conference-themes"
  }
];

export default function EventHighlights() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Event Highlights</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Exploring Data Science and Statistics
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Join leading experts to explore advancements in statistical methods and their applications in data science.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight, index) => {
              // For the "Research Themes" card, use a direct anchor tag for better hash navigation
              if (highlight.title === "20+") {
                return (
                  <a 
                    key={index} 
                    href={highlight.link}
                    className="no-underline text-inherit"
                  >
                    <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-primary hover:border-opacity-50 hover:translate-y-[-2px] transition-transform">
                      <div className={`p-5 ${highlight.bgColor} flex justify-center`}>
                        {highlight.icon}
                      </div>
                      <div className="px-6 py-4">
                        <div className="font-bold text-2xl text-center text-gray-800 stat-font">{highlight.title}</div>
                        <p className="text-gray-600 text-center">{highlight.description}</p>
                      </div>
                    </div>
                  </a>
                );
              }
              
              // For other cards, use the Link component
              return (
                <Link key={index} href={highlight.link}>
                  <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-primary hover:border-opacity-50 hover:translate-y-[-2px] transition-transform">
                    <div className={`p-5 ${highlight.bgColor} flex justify-center`}>
                      {highlight.icon}
                    </div>
                    <div className="px-6 py-4">
                      <div className="font-bold text-2xl text-center text-gray-800 stat-font">{highlight.title}</div>
                      <p className="text-gray-600 text-center">{highlight.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
