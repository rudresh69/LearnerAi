import React, { useState } from 'react';
import { TabType } from '../types';
import { BrainCircuit, Lightbulb, FileText } from 'lucide-react';

interface MindMapFormProps {
  onSubmit: (topic: string, type: TabType, text?: string) => void;
  isLoading: boolean;
}

const MindMapForm: React.FC<MindMapFormProps> = ({ onSubmit, isLoading }) => {
  const [activeTab, setActiveTab] = useState<TabType>('simple');
  const [topic, setTopic] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit(topic, activeTab, activeTab === 'text' ? text : undefined);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 max-w-3xl w-full mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        Generate Your Mind Map
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center sm:justify-start border-b mb-6 gap-2 sm:gap-4">
        {[
          { id: 'simple', label: 'Simple Mind Map', icon: BrainCircuit },
          { id: 'analogy', label: 'Analogy-Based', icon: Lightbulb },
          { id: 'text', label: 'Text-to-Mind Map', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`flex items-center px-3 py-2 rounded-md text-sm sm:text-base ${
              activeTab === id ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:text-blue-600'
            } transition`}
            onClick={() => setActiveTab(id as TabType)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Topic or Main Concept
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input-field w-full"
            placeholder="Enter the main topic for your mind map"
            required
          />
        </div>

        {activeTab === 'text' && (
          <div className="mb-4">
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
              Text Content (5-15 lines recommended)
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-field min-h-[150px] w-full"
              placeholder="Paste or type your text content here. The system will analyze it and extract key concepts for your mind map."
              rows={6}
              required
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-6 gap-4">
          <div className="text-sm text-gray-500 max-w-sm">
            {activeTab === 'simple' && <p>Creates a standard mind map with hierarchical concepts.</p>}
            {activeTab === 'analogy' && <p>Generates a mind map using a real-world analogy to explain the topic.</p>}
            {activeTab === 'text' && <p>Analyzes your text to extract key concepts and relationships.</p>}
          </div>

          <button
            type="submit"
            className="btn-primary px-5 py-2 flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A7.9 7.9 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              'Generate Mind Map'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MindMapForm;
