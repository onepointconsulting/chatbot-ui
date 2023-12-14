const port = 8082;
const server = '176.34.128.143';


const eventManagementChatConfig = {



                          streaming: true,
  showSidebar: false,
  botName: 'ChatGPT', // Name of the bot
  // Optional logo
  logoImage: '/shiva_star.png',
  // External link to a webpage
  logoLink: 'https://www.brahmakumaris.uk/',
  // Optional title
  title: 'Event Chat',
  // The socket to where to connect.
  websocketUrl: `ws://${server}:${port}`,
  sourceDownloadUrl: `http://${server}:${port}/files`,
  uploadedFilesUrl: ``,
                    uploadUrl: `http://${server}:${port}/upload`,
  defaultQuestionsPrompt:
    'Please ask some event related questions, like e.g:',
  exampleQuestions: [
    'Can you please list all health related events in the United Kingdom?',
    'Can you show me all events in Ireland?',
    'I am interested in events for women.',
    'I am interested in events for men.',
    'I am interested in events about the environment.',
    'Can you list future events in the Global Cooperation House?',
  ],
};