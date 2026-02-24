import { FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";

export function Footer() {
      

  return (
    <footer className="bg-black text-gray-300 py-8 sm:py-12 px-4 md:px-6 lg:px-8" >
      <div className="max-w-7xl mx-auto  flex flex-col md:flex-row justify-between items-center border-t pt-4 border-gray-800">
        <a href="/" className="mb-4 md:mb-0">
          <img
            src="https://i.imghippo.com/files/NPo1259thc.png" 
            alt="Company Logo"
            className="w-auto h-8 sm:h-10"
          />
          DevConnect
        </a>
        <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4">
          <span className="text-xs sm:text-sm text-gray-400">Follow Us On Social Media</span>
          <div className="flex gap-4">
            <a
              href="https://linkedin.com"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="https://instagram.com"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="https://twitter.com"
              className="hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}

