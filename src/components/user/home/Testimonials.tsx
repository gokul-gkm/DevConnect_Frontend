"use client";

import { TestimonialCards } from "@/components/ui/TestimonialsCards";
export function Testimonials() {
  return (
    <div>
      <h1 className="text-center font-bold text-3xl">Testimonials</h1>
      <div className="h-[20rem] rounded-md flex flex-col antialiased bg-black dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <TestimonialCards items={testimonials} direction="right" speed="slow" />
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "DevConnect has transformed the way I collaborate with other developers. The community is incredibly supportive.",
    author: "Sarah Johnson",
    role: "Senior Developer",
    avatar: "https://i.imghippo.com/files/GFY5894omo.jpg",
  },
  {
    quote:
      "The mentorship program helped me accelerate my learning journey. I'm now confident in taking on complex projects.",
    author: "Michael Chen",
    role: "Full Stack Developer",
    avatar: "https://i.imghippo.com/files/GFY5894omo.jpg",
  },
  {
    quote:
      "The resources and learning materials available here are top-notch. It's been invaluable for my professional growth.",
    author: "Emma Williams",
    role: "Frontend Developer",
    avatar: "https://i.imghippo.com/files/GFY5894omo.jpg",
  },
];
