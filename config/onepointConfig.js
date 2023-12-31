const port = 8082;
const server = '176.34.128.143';

const onepointChatConfig = {
  streaming: false,
  // whether to show the sidebar or not
  showSidebar: true,
  botName: 'ChatGPT', // Name of the bot
  // Optional logo
  logoImage: '/logo-one-point.png',
  // External link to a webpage
  logoLink: 'https://www.onepointltd.com/',
  // Optional title
  title: 'Chat',
  // Number of history messages to load.
  historySize: 20,
  // The socket to where to connect.
  websocketUrl: `ws://${server}:${port}`,
  sourceDownloadUrl: `http://${server}:${port}/files`,
  uploadedFilesUrl: `http://${server}:${port}/upload/files`,
  uploadUrl: `http://${server}:${port}/upload`,
  exampleQuestions: [
    'Can you give us a quick intro to the client and the problem they wanted to solve that led them to reach out to OnePoint?',
    'What were some of the key challenges and pain points their travel management teams were facing day-to-day?',
    "We'd love to hear more about the workshop approach you took to deeply understand their needs. How did that set you up to deliver an innovative solution?",
    'Walk us through some of the biggest improvements and benefits the new data platform drove for their business.',
    'For other tech leaders and innovators in our community, what are 1-2 key takeaways or lessons you want them to learn from this success story with a leading travel company?',
    "Which are Onepoint's credentials in the energy sector?",
    'How does Onepoint bring value to its clients?',
    'Which technologies is Onepoint proficient with?',
    'Which credentials does Onepoint have in the travel industry?',
    "What is Onepoint's approach to software development?",
    "Which are Onepoint's main achievements overall?",
    'How can I contact Onepoint?',
  ],
};
