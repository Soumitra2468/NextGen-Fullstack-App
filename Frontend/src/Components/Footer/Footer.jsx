import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          {/* Logo and Info */}
          <div>
            <h2 className="text-xl font-bold text-blue-600">MyLogo</h2>
            <p className="text-sm mt-2">
              © {new Date().getFullYear()} MyCompany. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-600 font-medium">
              Home
            </a>
            <a href="#" className="hover:text-blue-600 font-medium">
              About
            </a>
            <a href="#" className="hover:text-blue-600 font-medium">
              Services
            </a>
            <a href="#" className="hover:text-blue-600 font-medium">
              Contact
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-600">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-blue-600">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-blue-600">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-blue-600">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
