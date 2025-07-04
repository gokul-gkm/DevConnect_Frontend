import { HeroHighlight } from "@/components/ui/Background-gradient-animation";
import { Link } from "react-router-dom";

export default function DevHeroSection() {
  return (
    <div className="w-full bg-black">

      <HeroHighlight className="h-auto">

        <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-semibold text-white sm:text-4xl">
              Ready to Become a DevConnect Developer?
            </h1>

            <p className="mb-8 text-sm text-neutral-400 sm:text-base">
              Join as a developer and start sharing your expertise by mentoring and conducting sessions for learners. Build your profile, manage your sessions, and connect with aspiring developers looking to grow under your guidance.
            </p>


            <div className="mb-4">
              <p className="text-sm text-neutral-400">Get Started Today</p>
            </div>


            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              
              <Link to={'/developer/auth/register'} className="inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-neutral-900 transition-colors hover:border hover:border-neutral-800 hover:bg-neutral-900 hover:text-white">
                Signup as a Developer
              </Link>
              <Link to={'/developer/auth/login'} className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-800 bg-transparent px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
                Signin
              </Link>
            </div>
          </div>
        </div>
      </HeroHighlight>
    </div>
  );
}