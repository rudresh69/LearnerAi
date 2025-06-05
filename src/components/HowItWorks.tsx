import React from 'react';
import { Sparkles, Edit3, Share2, Download } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Edit3 className="h-8 w-8 text-blue-600" />,
      title: 'Enter Your Topic',
      description: 'Start by entering a topic, concept, or paragraph. You can even use analogies!',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-purple-600" />,
      title: 'Generate Mind Map',
      description: 'Our AI will instantly generate a structured and visually appealing mind map.',
    },
    {
      icon: <Share2 className="h-8 w-8 text-green-600" />,
      title: 'Refine & Explore',
      description: 'Explore the generated map, make edits, and discover related concepts or images.',
    },
    {
      icon: <Download className="h-8 w-8 text-red-600" />,
      title: 'Export & Use',
      description: 'Download your mind map as an SVG or PDF to use in presentations, notes, or print.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          From idea to visualization in seconds. Follow these simple steps to create your custom mind map.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
