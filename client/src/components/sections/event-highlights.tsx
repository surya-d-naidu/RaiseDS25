import { 
  Beaker, 
  Droplets, 
  Lightbulb, 
  Globe 
} from "lucide-react";

const highlights = [
  {
    icon: <Beaker className="w-16 h-16 text-primary" />,
    title: "Materials Science",
    description: "Next-Gen Research",
    bgColor: "bg-primary-50"
  },
  {
    icon: <Droplets className="w-16 h-16 text-secondary" />,
    title: "Water Solutions",
    description: "Sustainable Technologies",
    bgColor: "bg-secondary-50"
  },
  {
    icon: <Lightbulb className="w-16 h-16 text-blue-500" />,
    title: "Energy Innovation",
    description: "Clean Technologies",
    bgColor: "bg-blue-50"
  },
  {
    icon: <Globe className="w-16 h-16 text-green-500" />,
    title: "Global Collaboration",
    description: "International Research",
    bgColor: "bg-green-50"
  }
];

export default function EventHighlights() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Event Highlights</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Sustainable Materials for Water & Energy
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Join leading researchers in exploring next-generation sustainable materials for addressing global water and energy challenges.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className={`p-5 ${highlight.bgColor} flex justify-center`}>
                  {highlight.icon}
                </div>
                <div className="px-6 py-4">
                  <div className="font-bold text-lg text-center text-gray-800">{highlight.title}</div>
                  <p className="text-gray-600 text-center text-sm">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
