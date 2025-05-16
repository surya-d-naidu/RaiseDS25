import { Link } from "wouter";
import { BarChart2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import { getImageWithFallback } from "@/lib/asset-utils";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">            <div className="flex flex-col items-center md:items-start bg-gray-50 p-4 rounded-lg shadow-sm">              <Link href="/">
                <img 
                  {...getImageWithFallback('logo.jpeg', 'logo.png')}
                  alt="RAISE DS Logo" 
                  className="h-16 w-auto mb-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200" 
                />
              </Link>
              <span className="text-xl font-bold text-gray-900">RAISE DS 2025</span>
            </div>
            <p className="mt-4 text-gray-500 text-sm text-center md:text-left">
              International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science
            </p>
            <p className="mt-2 text-gray-500 text-sm text-center md:text-left">
              December 22-24, 2025<br />
              VIT-AP University, Vijayawada
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Conference</h3>
            <ul role="list" className="mt-4 space-y-4">
              <li>
                <Link href="/about">
                  <a className="text-base text-gray-500 hover:text-gray-900">
                    About
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/call-for-papers">
                  <a className="text-base text-gray-500 hover:text-gray-900">
                    Call for Papers
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <a className="text-base text-gray-500 hover:text-gray-900">
                    Important Dates
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <a className="text-base text-gray-500 hover:text-gray-900">
                    Program
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
            <ul role="list" className="mt-4 space-y-4">
              <li>
                <a href="/api/brochure" className="text-base text-gray-500 hover:text-gray-900">
                  Brochure
                </a>
              </li>
              <li>
                <Link href="/call-for-papers">
                  <a className="text-base text-gray-500 hover:text-gray-900">
                    Submission Guidelines
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/call-for-papers">
                  <a className="text-base text-gray-500 hover:text-gray-900">
                    Templates
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-base text-gray-500 hover:text-gray-900">
                    FAQ
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
            <ul role="list" className="mt-4 space-y-4">
              <li className="flex">
                <Mail className="flex-shrink-0 h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base text-gray-500">raiseds25@vitap.ac.in</span>
              </li>
              <li className="flex">
                <Phone className="flex-shrink-0 h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base text-gray-500">+91-7673944853</span>
              </li>
              <li className="flex">
                <MapPin className="flex-shrink-0 h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base text-gray-500">VIT-AP University, Amaravati, Andhra Pradesh</span>
              </li>
            </ul>
            
            <div className="mt-8 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>

              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>

              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">&copy; 2025 RAISE DS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
