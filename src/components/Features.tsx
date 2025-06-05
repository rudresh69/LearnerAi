import React from 'react';
import {
  BrainCircuit,
  Lightbulb,
  FileText,
  Download,
  Zap,
  Image,
} from 'lucide-react';

const features = [
  {
    icon: <BrainCircuit className="h-10 w-10 text-blue-500" />,
    title: 'Simple Mind Maps',
    description:
      'Create clear, hierarchical mind maps with concepts and subconcepts for any topic.',
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-purple-500" />,
    title: 'Analogy-Based Maps',
    description:
      'Generate mind maps using real-world analogies to make complex topics more understandable.',
  },
  {
    icon: <FileText className="h-10 w-10 text-indigo-500" />,
    title: 'Text-to-Mind Map',
    description:
      'Convert paragraphs of text into structured mind maps by extracting key concepts and relationships.',
  },
  {
    icon: <Download className="h-10 w-10 text-green-500" />,
    title: 'Export Options',
    description:
      'Download your mind maps as high-quality SVG files for use in presentations, documents, or printing.',
  },
  {
    icon: <Zap className="h-10 w-10 text-yellow-500" />,
    title: 'Real-Time Generation',
    description:
      'See your mind maps come to life instantly with our powerful AI-driven generation engine.',
  },
  {
    icon: <Image className="h-10 w-10 text-red-500" />,
    title: 'Related Images',
    description:
      'Discover relevant images that complement your mind map topic for enhanced visual learning.',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Our mind map generator offers a range of powerful features to help you visualize concepts and ideas effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base flex-grow">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
