import { X, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-6 mt-auto">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <p className="text-sm">@ 2025 FlashTalks, Inc. All rights reserved</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:opacity-80 transition-opacity">
            <X size={20} />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <Instagram size={20} />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
