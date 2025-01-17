"use client";

import { useState } from "react";
import { Search, Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

const faqData: FAQItem[] = [
  {
    question: "How can DevConnect help me find networking opportunities with other developers?",
    answer: "DevConnect offers a unique networking platform where developers can connect through virtual events, forums, and more. Through virtual events, discussion forums, and collaborative projects, you'll find numerous opportunities to network with peers.",
  },
  {
    question: "Can I find job opportunities on DevConnect?",
    answer: "Yes, DevConnect features a dedicated job board and career opportunities section for developers.",
  },
  {
    question: "What measures does DevConnect take to protect my personal information?",
    answer: "We implement industry-standard security measures and strict privacy policies to protect all user data.",
  },
  {
    question: "How do I get involved in the community discussions on DevConnect?",
    answer: "You can participate in our forums, join live discussions, and engage with other members through our community platform.",
  },
  {
    question: "Is there a cost to join DevConnect, and what do I get with the membership?",
    answer: "Our membership includes access to premium features, networking events, and educational resources. Contact us for detailed pricing information.",
  },
  {
    question: "How does DevConnect ensure the quality of educational resources?",
    answer: "We maintain strict quality standards and regularly update our educational content with industry experts' input.",
  },
  {
    question: "Can I post my own content or organize events on DevConnect?",
    answer: "Yes, members can contribute content and organize community events following our guidelines.",
  },
  {
    question: "Does DevConnect offer support for developers at different skill levels?",
    answer: "We provide resources and support for developers at all stages, from beginners to advanced professionals.",
  },
];

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (question: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  const filteredFAQs = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const midPoint = Math.ceil(filteredFAQs.length / 2);
  const leftColumnFAQs = filteredFAQs.slice(0, midPoint);
  const rightColumnFAQs = filteredFAQs.slice(midPoint);

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 md:px-12 md:mx-8 lg:px-8">
      <div className="max-w-[1200px] mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-medium mb-4">
            <span className="text-gray-500">Frequently</span> Asked Questions
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Got questions? We've got answers. Check out our frequently asked questions section to find valuable insights into our
            processes, pricing, and more. Transparency is at the core of our client interactions.
          </p>
        </div>

        <div className="relative mb-12 max-w-sm mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-transparent transition-all duration-200"
          />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">

          <div>
            {leftColumnFAQs.map((item, index) => (
              <div
                key={item.question}
                className={`py-4 ${
                  index !== leftColumnFAQs.length - 1 ? 'border-b border-zinc-800' : ''
                }`}
              >
                <button
                  onClick={() => toggleItem(item.question)}
                  className="w-full flex justify-between items-start text-left"
                >
                  <span className="text-white text-sm pr-8">{item.question}</span>
                  {openItems[item.question] ? (
                    <Minus className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openItems[item.question]
                      ? 'max-h-96 opacity-100 mt-2'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-gray-400 text-sm">{item.answer}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            {rightColumnFAQs.map((item, index) => (
              <div
                key={item.question}
                className={`py-4 ${
                  index !== rightColumnFAQs.length - 1 ? 'border-b border-zinc-800' : ''
                }`}
              >
                <button
                  onClick={() => toggleItem(item.question)}
                  className="w-full flex justify-between items-start text-left"
                >
                  <span className="text-white text-sm pr-8">{item.question}</span>
                  {openItems[item.question] ? (
                    <Minus className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openItems[item.question]
                      ? 'max-h-96 opacity-100 mt-2'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-gray-400 text-sm">{item.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

