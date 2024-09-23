// const protocol = 'https';
// const websocketProtocol = 'wss';
// const port = 443;
// const server = 'd-wise.onepointltd.ai';

const protocol = 'http';
const websocketProtocol = 'ws';
const port = 8083;
const server = 'localhost';
const tokenValidationUrl = `https://d-well.onepointltd.ai/validate_jwt_token`;

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
  historySize: 500,
  // The socket to where to connect.
  websocketUrl: `${websocketProtocol}://${server}:${port}`,
  sourceDownloadUrl: `${protocol}://${server}:${port}/files`,
  reportUrl: `${protocol}://${server}:${port}/report`,
  uploadUrl: `${protocol}://${server}:${port}/upload`,
  chartProgressUrl: `${protocol}://${server}:${port}/spider_chart`,
  barchartProgressUrl: `${protocol}://${server}:${port}/barchart`,
  defaultQuestionsPrompt: '',
  exampleQuestions: [],
  tokenValidationUrl
};
