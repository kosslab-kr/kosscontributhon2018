import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import next from 'next';
import morgan from 'morgan';
// import bodyParser from 'body-parser';
import path from 'path';

// handler
import eventsHandler from './handler/events';
import projectHandler from './handler/project';

const ParseServer = require('parse-server').ParseServer;
const S3Adapter = require('parse-server').S3Adapter;
const ParseDashboard = require('parse-dashboard');

// config
const PARSE_CONFIG = JSON.parse(process.env.PARSE_CONFIG.replace(/'/gi, '"'));
const PARSE_APP = PARSE_CONFIG.apps[0];
if (!PARSE_APP.databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
const PARSE_LOCALURL = process.env.PORT
  ? `http://localhost:${process.env.PORT}/parse`
  : PARSE_APP.localServerURL || 'http://localhost:1337/parse';

// next
const port = parseInt(process.env.PORT, 10) || 1337;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

process.on('SIGINT', () => process.exit());

function ParseWrap(Parse: any, handler: any) {
  return (req, res) => {
    req.Parse = Parse;
    return handler(req, res).catch(err => {
      console.log('ERR:', err);
      res.status(400).end();
    });
  };
}

app.prepare().then(() => {
  // set up
  const server = express();

  if (dev) {
    server.use(morgan('tiny'));
  }

  // parse server
  const api = new ParseServer({
    databaseURI: PARSE_APP.databaseUri || 'mongodb://localhost:27017/dev',
    cloud: PARSE_APP.cloudCodeMain || path.join(__dirname, '../cloud/main'),
    appId: PARSE_APP.appId || 'myAppId',
    masterKey: PARSE_APP.masterKey || '', // Add your master key here. Keep it secret!
    fileKey: PARSE_APP.fileKey || '', // Add the file key to provide access to files already hosted on Parse
    serverURL: PARSE_LOCALURL, // Don't forget to change to https if needed
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
  server.use(mountPath, api);

  // parse dashboard
  const dashboard = new ParseDashboard(PARSE_CONFIG, {
    allowInsecureHTTP: true,
  });

  // make the Parse Dashboard available at /dashboard
  server.use('/dashboard', dashboard);

  // add handler
  addHandler(server);

  // if root, render webpage from next
  server.get('/*', (req, res) => app.render(req, res, '/', req.query));

  // otherwise, try and get gist
  server.get('*', handle as any);

  server.listen(port, '0.0.0.0', err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });

  // cron jobs for production
  addCron();
});

function addHandler(server: express.Express) {
  // Parse for node client
  const Parse = require('parse/node').Parse;
  Parse.initialize(PARSE_APP.appId || 'myAppId', null, PARSE_APP.masterKey || '');
  Parse.serverURL = PARSE_LOCALURL;

  // hanlder
  server.get('/api/events', ParseWrap(Parse, eventsHandler.getEvents));
  server.get('/api/projects', ParseWrap(Parse, projectHandler.getProjects));
}

function addCron() {
  if (process.env.NODE_ENV === 'production') {
    // Parse for node client
    const Parse = require('parse/node').Parse;
    Parse.initialize(PARSE_APP.appId || 'myAppId', null, PARSE_APP.masterKey || '');
    // use external url for preventing heroku sleep
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
    crond.addCron('backgroundJob', '0 */15 * * * *'); // per 15 minutes

    // start
    crond.start();
  }
}
