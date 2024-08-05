const protocol = 'https';
const websocketProtocol = 'wss';
const port = 443;
// const port = 8085;
const server = 'd-wise.onepointltd.ai';
// const server = '176.34.128.143';

const dataAssessmentConfig = {
  streaming: false,
  // whether to show the sidebar or not
  showSidebar: false,
  supportsSession: true,
  showRefreshButton: false,
  botName: 'Data Assessment', // Name of the bot
  // Optional logo
  logoImage: '/logo.svg',
  // External link to a webpage
  logoLink: 'https://onepointltd.com/',
  // Optional title
  title: 'D-Wise',
  // Number of history messages to load. 0 means no history.
  historySize: 10,
  // The socket to where to connect.
  websocketUrl: `${websocketProtocol}://${server}:${port}`,
  sourceDownloadUrl: `${protocol}://${server}:${port}/files`,
  reportUrl: `${protocol}://${server}:${port}/report`,
  uploadUrl: `${protocol}://${server}:${port}/upload`,
  chartProgressUrl: `${protocol}://${server}:${port}/spider_chart`,
  barchartProgressUrl: `${protocol}://${server}:${port}/barchart`,
  defaultQuestionsPrompt: '',
  exampleQuestions: [],
};
