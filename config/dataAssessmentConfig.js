const protocol = 'http';
const port = 8083;
const server = 'localhost';

const dataAssessmentConfig = {
  streaming: false,
  // whether to show the sidebar or not
  showSidebar: false,
  supportsSession: true,
  botName: 'Data Assessment', // Name of the bot
  // Optional logo
  logoImage: '/logo-one-point-white.png',
  // External link to a webpage
  logoLink: 'https://onepointltd.com/',
  // Optional title
  title: 'Data Assessment Companion',
  // Number of history messages to load. 0 means no history.
  historySize: 10,
  // The socket to where to connect.
  websocketUrl: `ws://${server}:${port}`,
  sourceDownloadUrl: `${protocol}://${server}:${port}/files`,
  reportUrl: `${protocol}://${server}:${port}/report`,
  uploadUrl: `${protocol}://${server}:${port}/upload`,
  chartProgressUrl: `${protocol}://${server}:${port}/spider_chart`,
  barchartProgressUrl: `${protocol}://${server}:${port}/barchart`,
  defaultQuestionsPrompt: '',
  exampleQuestions: [],
};
