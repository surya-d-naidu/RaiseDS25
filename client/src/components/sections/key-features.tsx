import { 
  Globe, 
  Briefcase, 
  Zap, 
  Users, 
  Shield, 
  Award 
} from "lucide-react";

const features = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Speakers",
    description: "Engage with renowned statisticians and data scientists from around the world, sharing insights on the latest advancements in the field."
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: "Specialized Workshops",
    description: "Participate in hands-on sessions focused on practical applications of statistical methods in data science and machine learning."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Research Presentations",
    description: "Showcase your work through oral and poster presentations, receiving valuable feedback from peers and experts in the field."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Networking Opportunities",
    description: "Connect with peers, potential collaborators, and industry leaders through structured networking sessions and social events."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Publication Opportunities",
    description: "Selected papers will be considered for publication in reputed journals and conference proceedings, enhancing your research visibility."
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Awards & Recognition",
    description: "Outstanding research contributions will be recognized through various awards, encouraging excellence in the field of statistics and data science."
  }
];

export default function KeyFeatures() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Key Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Conference Highlights
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Engage with cutting-edge research and networking opportunities
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  {feature.icon}
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
