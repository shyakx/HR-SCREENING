import { QuizQuestion } from '../models';

export const sampleQuizQuestions = [
  // Technology - Foundational
  {
    roleCategory: 'technology' as const,
    difficulty: 'foundational' as const,
    questionType: 'multiple-choice' as const,
    question: 'What is the primary purpose of using version control systems like Git in software development?',
    options: [
      'To track changes and collaborate with other developers',
      'To make the code run faster',
      'To improve user interface design',
      'To reduce file sizes'
    ],
    correctAnswer: 0,
    explanation: 'Version control systems like Git help developers track changes, collaborate, and manage different versions of code effectively.',
    skills: ['Git', 'Version Control', 'Collaboration'],
    timeLimit: 60,
    points: 10,
    isActive: true,
    metadata: {
      localContext: true,
      institutionRelevant: ['CMU-Africa', 'UR'],
      language: 'english'
    },
    usage: {
      timesUsed: 0,
      averageScore: 0,
      lastUsed: new Date()
    }
  },
  {
    roleCategory: 'technology' as const,
    difficulty: 'foundational' as const,
    questionType: 'scenario' as const,
    question: 'A user reports that your web application is running slowly. What would be your first step to diagnose the issue?',
    correctAnswer: 'Check browser developer tools for network requests and console errors',
    explanation: 'The first step in diagnosing performance issues is to gather data about what\'s happening. Browser dev tools provide immediate insights into network requests, JavaScript errors, and resource loading times.',
    skills: ['Debugging', 'Performance Optimization', 'Problem Solving'],
    timeLimit: 120,
    points: 15,
    isActive: true,
    metadata: {
      localContext: true,
      institutionRelevant: ['CMU-Africa', 'UR', 'INES'],
      language: 'english'
    },
    usage: {
      timesUsed: 0,
      averageScore: 0,
      lastUsed: new Date()
    }
  },

  // Technology - Intermediate
  {
    roleCategory: 'technology' as const,
    difficulty: 'intermediate' as const,
    questionType: 'practical' as const,
    question: 'Describe how you would implement secure user authentication in a web application. Include the key security considerations.',
    correctAnswer: 'Implementation should include password hashing, token-based authentication, HTTPS, input validation, and protection against common attacks like SQL injection and XSS.',
    explanation: 'Secure authentication requires multiple layers: password hashing (bcrypt), JWT tokens, HTTPS encryption, input sanitization, and protection against OWASP top vulnerabilities.',
    skills: ['Security', 'Authentication', 'Web Development'],
    timeLimit: 180,
    points: 20,
    isActive: true,
    metadata: {
      localContext: true,
      institutionRelevant: ['CMU-Africa', 'UR'],
      language: 'english'
    },
    usage: {
      timesUsed: 0,
      averageScore: 0,
      lastUsed: new Date()
    }
  },

  // Sales - Foundational
  {
    roleCategory: 'sales' as const,
    difficulty: 'foundational' as const,
    questionType: 'scenario' as const,
    question: 'A potential customer says "Your product is too expensive compared to competitors." How would you respond?',
    correctAnswer: 'Acknowledge their concern, ask about their budget and specific needs, then demonstrate the unique value and ROI that justifies the price difference.',
    explanation: 'The key is to understand their perspective, validate their concern, and then shift the conversation from price to value and ROI.',
    skills: ['Objection Handling', 'Value Proposition', 'Communication'],
    timeLimit: 90,
    points: 10,
    isActive: true,
    metadata: {
      localContext: true,
      institutionRelevant: ['Private', 'International'],
      language: 'english'
    },
    usage: {
      timesUsed: 0,
      averageScore: 0,
      lastUsed: new Date()
    }
  },

  // Sales - Intermediate
  {
    roleCategory: 'sales' as const,
    difficulty: 'intermediate' as const,
    questionType: 'practical' as const,
    question: 'You need to develop a sales strategy for entering the Rwandan SME market. What key factors would you consider and how would you approach it?',
    correctAnswer: 'Strategy should include market research on SME needs, pricing models for local businesses, partnership opportunities with local business associations, understanding of procurement cycles, and adaptation to local business culture.',
    explanation: 'Rwandan SME market requires understanding local business practices, appropriate pricing, relationship-building, and awareness of local economic conditions and business support programs.',
    skills: ['Market Strategy', 'Local Market Knowledge', 'Business Development'],
    timeLimit: 150,
    points: 20,
    isActive: true,
    metadata: {
      localContext: true,
      institutionRelevant: ['Private', 'REB', 'TVET'],
      language: 'english'
    },
    usage: {
      timesUsed: 0,
      averageScore: 0,
      lastUsed: new Date()
    }
  },

  // Customer Service - Foundational
  {
    roleCategory: 'customer-service' as const,
    difficulty: 'foundational' as const,
    questionType: 'multiple-choice' as const,
    question: 'What is the most important first step when handling an angry customer?',
    options: [
      'Listen actively and acknowledge their feelings',
      'Immediately offer a discount or refund',
      'Explain company policy',
      'Transfer to a manager'
    ],
    correctAnswer: 0,
    explanation: 'Active listening and emotional validation are crucial first steps. The customer needs to feel heard before any problem-solving can begin.',
    skills: ['Active Listening', 'Empathy', 'Communication'],
    timeLimit: 60,
    points: 10,
    isActive: true,
    metadata: {
      localContext: true,
      institutionRelevant: ['Private', 'TVET'],
      language: 'english'
    },
    usage: {
      timesUsed: 0,
      averageScore: 0,
      lastUsed: new Date()
    }
  },

  // Customer Service - Intermediate
  {
    roleCategory: 'customer-service' as const,
    difficulty: 'intermediate' as const,
    questionType: 'scenario' as const,
    question: 'A customer is frustrated because they\'ve been waiting 48 hours for a response about their delayed order in Kigali. They\'re threatening to post on social media. How do you handle this situation?',
    correctAnswer: 'Immediately apologize for the delay, provide a specific timeline for resolution, offer a small goodwill gesture if appropriate, and escalate to ensure prompt follow-through while documenting everything.',
    explanation: 'In Rwanda\'s connected market, social media threats require immediate attention. The response should be swift, empathetic, solution-focused, and include proper escalation.',
    skills: ['Crisis Management', 'Social Media Awareness', 'Problem Resolution'],
    timeLimit: 120,
    points: 15,
    isActive: true,
    metadata: {
      localContext: true,
      institutionRelevant: ['Private', 'UR'],
      language: 'english'
    },
    usage: {
      timesUsed: 0,
      averageScore: 0,
      lastUsed: new Date()
    }
  },

  // Finance - Foundational
  {
    roleCategory: 'finance' as const,
    difficulty: 'foundational' as const,
    questionType: 'multiple-choice' as const,
    question: 'What is the main purpose of a balance sheet?',
    options: [
      'To show a company\'s financial position at a specific point in time',
      'To track revenue and expenses over a period',
      'To calculate cash flow',
      'To project future earnings'
    ],
    correctAnswer: 0,
    explanation: 'A balance sheet provides a snapshot of a company\'s assets, liabilities, and equity at a specific moment, showing its financial position.',
    skills: ['Financial Statements', 'Accounting Principles'],
    timeLimit: 60,
    points: 10,
    isActive: true,
    metadata: {
      localContext: true,
      institutionRelevant: ['UR', 'INES', 'Private'],
      language: 'english'
    },
    usage: {
      timesUsed: 0,
      averageScore: 0,
      lastUsed: new Date()
    }
  },

  // Finance - Intermediate
  {
    roleCategory: 'finance' as const,
    difficulty: 'intermediate' as const,
    questionType: 'practical' as const,
    question: 'You need to prepare a financial analysis for a Rwandan tech startup seeking investment. What key metrics and considerations would be most important for local investors?',
    correctAnswer: 'Analysis should include revenue growth rate, burn rate, runway, customer acquisition cost, LTV/CAC ratio, market size in Rwanda/East Africa, regulatory environment impact, and currency stability considerations.',
    explanation: 'Rwandan investors focus on sustainable growth, local market understanding, regulatory compliance, and regional expansion potential. Key metrics must reflect local business realities.',
    skills: ['Financial Analysis', 'Investment Metrics', 'Local Market Knowledge'],
    timeLimit: 180,
    points: 20,
    isActive: true,
    metadata: {
      localContext: true,
      institutionRelevant: ['UR', 'Private', 'International'],
      language: 'english'
    },
    usage: {
      timesUsed: 0,
      averageScore: 0,
      lastUsed: new Date()
    }
  }
];

export const seedQuizQuestions = async () => {
  try {
    console.log('Seeding sample quiz questions...');
    
    for (const questionData of sampleQuizQuestions) {
      const existingQuestion = await QuizQuestion.findOne({
        question: questionData.question,
        roleCategory: questionData.roleCategory,
        difficulty: questionData.difficulty
      });

      if (!existingQuestion) {
        const question = new QuizQuestion(questionData);
        await question.save();
        console.log(`Created question: ${question.question.substring(0, 50)}...`);
      }
    }

    console.log('Sample quiz questions seeded successfully!');
  } catch (error) {
    console.error('Error seeding quiz questions:', error);
  }
};
