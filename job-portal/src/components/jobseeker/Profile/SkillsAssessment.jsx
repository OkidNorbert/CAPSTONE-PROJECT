import React, { useState } from 'react';
import { cn } from '../../../utils/styles';

const mockSkillTests = [
  {
    id: 1,
    category: 'Programming',
    tests: [
      {
        id: 'prog-1',
        name: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics including variables, functions, and control flow.',
        duration: '45 min',
        questions: 30,
        difficulty: 'Intermediate',
        status: 'not_started',
      },
      {
        id: 'prog-2',
        name: 'React Development',
        description: 'Assess your React.js skills including components, hooks, and state management.',
        duration: '60 min',
        questions: 40,
        difficulty: 'Advanced',
        status: 'not_started',
      },
    ],
  },
  {
    id: 2,
    category: 'Design',
    tests: [
      {
        id: 'design-1',
        name: 'UI/UX Principles',
        description: 'Evaluate your understanding of user interface and experience design principles.',
        duration: '30 min',
        questions: 25,
        difficulty: 'Beginner',
        status: 'not_started',
      },
    ],
  },
  {
    id: 3,
    category: 'Soft Skills',
    tests: [
      {
        id: 'soft-1',
        name: 'Communication Skills',
        description: 'Assess your written and verbal communication abilities.',
        duration: '40 min',
        questions: 35,
        difficulty: 'Intermediate',
        status: 'not_started',
      },
      {
        id: 'soft-2',
        name: 'Problem Solving',
        description: 'Test your analytical and problem-solving capabilities.',
        duration: '50 min',
        questions: 30,
        difficulty: 'Advanced',
        status: 'not_started',
      },
    ],
  },
];

const SkillsAssessment = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTests = mockSkillTests.filter(category => 
    selectedCategory === 'all' || category.category.toLowerCase() === selectedCategory.toLowerCase()
  ).map(category => ({
    ...category,
    tests: category.tests.filter(test =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.tests.length > 0);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'advanced':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const handleStartTest = (testId) => {
    console.log('Starting test:', testId);
    // TODO: Implement test starting logic
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Skills Assessment
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={cn(
              "rounded-full px-4 py-2",
              "bg-white dark:bg-gray-800",
              "border border-gray-300 dark:border-gray-700",
              "text-gray-900 dark:text-white",
              "focus:ring-2 focus:ring-primary-500",
              "hover-effect"
            )}
          >
            <option value="all">All Categories</option>
            {mockSkillTests.map(category => (
              <option key={category.id} value={category.category.toLowerCase()}>
                {category.category}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "rounded-full px-4 py-2",
              "bg-white dark:bg-gray-800",
              "border border-gray-300 dark:border-gray-700",
              "text-gray-900 dark:text-white",
              "focus:ring-2 focus:ring-primary-500",
              "hover-effect",
              "w-full sm:w-64"
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredTests.map(category => (
          <div
            key={category.id}
            className={cn(
              "glass-effect p-6 rounded-2xl",
              "hover-effect"
            )}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {category.category}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {category.tests.map(test => (
                <div
                  key={test.id}
                  className={cn(
                    "p-4 rounded-xl",
                    "bg-white dark:bg-gray-800",
                    "border border-gray-200 dark:border-gray-700",
                    "hover:border-primary-500 dark:hover:border-primary-500",
                    "transition-all duration-300"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {test.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {test.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getDifficultyColor(test.difficulty)
                      )}
                    >
                      {test.difficulty}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>⏱ {test.duration}</span>
                      <span>❓ {test.questions} questions</span>
                    </div>
                    <button
                      onClick={() => handleStartTest(test.id)}
                      className={cn(
                        "button-gradient px-4 py-2 rounded-full",
                        "text-sm font-medium",
                        "hover-effect"
                      )}
                    >
                      Start Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No tests found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsAssessment;
