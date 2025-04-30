import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function CallToAction() {
  return (
    <div className="bg-primary-700">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to join the conference?</span>
          <span className="block">Register today and be part of RAISE DS 2025.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-primary-200">
          Join leading researchers, practitioners, and students to explore the latest advancements in statistics and data science.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Register Now
              </Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex">
            <a href="/api/brochure" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="bg-primary-600 text-white hover:bg-primary-800 border-primary-500">
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
