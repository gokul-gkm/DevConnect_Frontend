
import { FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";

export function Footer() {
    const mainSections = [
        {
          title: "Home",
          links: [
            { name: "Overview", href: "/" },
            { name: "Features", href: "/features" },
            { name: "Testimonials", href: "/testimonials" },
          ],
        },
        {
          title: "Services",
          links: [
            { name: "Developer Sessions", href: "/services/sessions" },
            { name: "Community Chat", href: "/services/community-chat" },
            { name: "Video Consultations", href: "/services/video-consultations" },
            { name: "Interactive Code Editor", href: "/services/code-editor" },
          ],
        },
        {
          title: "Resources",
          links: [
            { name: "Blogs", href: "/resources/blogs" },
            { name: "Tutorials", href: "/resources/tutorials" },
            { name: "Coding Challenges", href: "/resources/challenges" },
            { name: "Leaderboards", href: "/resources/leaderboards" },
          ],
        },
        {
          title: "About Us",
          links: [
            { name: "Our Mission", href: "/about/mission" },
            { name: "Team", href: "/about/team" },
            { name: "Careers", href: "/about/careers" },
          ],
        },
        {
          title: "Support",
          links: [
            { name: "FAQs", href: "/support/faqs" },
            { name: "Contact Us", href: "/support/contact" },
            { name: "Report an Issue", href: "/support/report" },
          ],
        },
        {
          title: "Legal",
          links: [
            { name: "Privacy Policy", href: "/legal/privacy" },
            { name: "Terms & Conditions", href: "/legal/terms" },
            { name: "Cookie Policy", href: "/legal/cookies" },
          ],
        },
      ];
      

  return (
    <footer className="bg-black text-gray-300 py-12 px-4 md:px-6 lg:px-8">
      {/* Top Section with Logo and Social Media */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center">
        <a href="/" className="mb-6 md:mb-0">
          <img
            src="https://i.imghippo.com/files/NPo1259thc.png" // Replace with your actual logo path
            alt="Company Logo"
            className="w-auto h-10"
          />
        </a>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="text-sm text-gray-400">Follow Us On Social Media</span>
          <div className="flex gap-4">
            <a
              href="https://linkedin.com"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              className="hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
        {mainSections.map((section) => (
          <div key={section.title} className="flex flex-col">
            <h3 className="text-white font-medium mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div>©2024 DevConnect. All Rights Reserved</div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </a>
            <a href="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

