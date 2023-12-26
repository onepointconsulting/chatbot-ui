const port = 8083;
const server = 'localhost';

const eventManagementChatConfig = {
  streaming: false,
  // whether to show the sidebar or not
  showSidebar: false,
  botName: 'Data Assessment', // Name of the bot
  // Optional logo
  logoImage: '/logo-one-point.png',
  // External link to a webpage
  logoLink: 'https://onepointltd.com/',
  // Optional title
  title: 'Data Assessment Companion',
  // Number of history messages to load. 0 means no history.
  historySize: 2,
  // The socket to where to connect.
  websocketUrl: `ws://${server}:${port}`,
  sourceDownloadUrl: `http://${server}:${port}/files`,
  uploadedFilesUrl: ``,
  uploadUrl: `http://${server}:${port}/upload`,
  defaultQuestionsPrompt: '',
  exampleQuestions: [],
};
