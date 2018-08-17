import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// parse server
import express from 'express';
import path from 'path';

const ParseServer = require('parse-server').ParseServer;
const S3Adapter = require('parse-server').S3Adapter;
const ParseDashboard = require('parse-dashboard');

// config
const PARSE_CONFIG = JSON.parse(process.env.PARSE_CONFIG.replace(/'/gi, '"'));

// express
const app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '../public')));

// create api server
const PARSE_APP = PARSE_CONFIG.apps[0];
if (!PARSE_APP.databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
if (!PARSE_APP.serverURL) {
  PARSE_APP.serverURL = PARSE_APP.localServerURL || 'http://localhost:1337/parse';
}

// parse server
const api = new ParseServer({
  databaseURI: PARSE_APP.databaseUri || 'mongodb://localhost:27017/dev',
  cloud: PARSE_APP.cloudCodeMain || path.join(__dirname, '../cloud/main'),
  appId: PARSE_APP.appId || 'myAppId',
  masterKey: PARSE_APP.masterKey || '', // Add your master key here. Keep it secret!
  fileKey: PARSE_APP.fileKey || '', // Add the file key to provide access to files already hosted on Parse
  serverURL: PARSE_APP.serverURL, // Don't forget to change to https if needed
  // liveQuery: {
  //   classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  // },
  // push: {
  //   adapter: new OneSignalPushAdapter({
  //     oneSignalAppId: process.env.ONESIGNAL_APP_ID,
  //     oneSignalApiKey: process.env.ONESIGNAL_API_KEY,
  //   }),
  // },
  filesAdapter: new S3Adapter(process.env.S3_ACCESS_KEY, process.env.S3_SECRET_KEY, PARSE_APP.s3Bucket, {
    region: process.env.S3_REGION,
    directAccess: process.env.S3_DIRECT_ACCESS,
  }),
});

// Serve the Parse API on the /parse URL prefix
const mountPath = PARSE_APP.mountPath || '/parse';
app.use(mountPath, api);

// cron jobs for production
if (process.env.NODE_ENV === 'production') {
  // Parse for node client
  const Parse = require('parse/node').Parse;
  Parse.initialize(PARSE_APP.appId || 'myAppId', null, PARSE_APP.masterKey || '');
  Parse.serverURL = PARSE_APP.serverURL;

  // [ CronJob ]
  // Seconds: 0-59
  // Minutes: 0-59
  // Hours: 0-23
  // Day of Month: 1-31
  // Months: 0-11
  // Day of Week: 0-6

  // cronjob set
  const CloudCode = require('./CloudCode');
  const crond = new CloudCode(Parse, 'Asia/Seoul');

  // backgroundJob
  crond.putJob('backgroundJob', null);
  crond.addCron('backgroundJob', '0 */3 * * * *'); // per 3 minutes

  // start
  crond.start();
}

// parse dashboard
const dashboard = new ParseDashboard(PARSE_CONFIG, {
  allowInsecureHTTP: true,
});

// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

// Parse Server plays nicely with the rest of your web routes
app.get('/', (req, res) => {
  res.status(200).send('Make sure to star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/test.html'));
});

const port = process.env.PORT || 1337;
const httpServer = require('http').createServer(app);

httpServer.listen(port, () => {
  console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
// ParseServer.createLiveQueryServer(httpServer);
