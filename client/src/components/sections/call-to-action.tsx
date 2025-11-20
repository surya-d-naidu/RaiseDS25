import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function CallToAction() {
  return (
    <div className="bg-primary">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to join the conference?</span>
          <span className="block">Register today and be part of SuWatE+'26.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-white/90">
          Join leading researchers, practitioners, and students to explore the latest advancements in sustainable materials for water and energy solutions.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Link href="/register">
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-50">
                Register Now
              </Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex">
            <a href="/api/brochure" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="bg-secondary text-white hover:bg-secondary/90 border-secondary">
                <Download className="mr-2 h-4 w-4" />
                Download Brochure
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
