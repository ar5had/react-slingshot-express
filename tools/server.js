// common server for both production and development
import historyApiFallback from 'connect-history-api-fallback';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { chalkSuccess } from './chalkConfig';
import config from '../webpack.config.dev';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';

const environment = process.argv[2];
const app = express();
const server = http.createServer(app);

/* eslint-disable no-console */
console.log(chalkSuccess(`Starting Express server in ${environment} mode...`));

if (environment !== "production") {
  const bundler = webpack(config);

  app.use(express.static('src/*.html'));
  app.use(historyApiFallback());
  app.use(webpackHotMiddleware(bundler));
  app.use(webpackDevMiddleware(bundler, {
    // Dev middleware can't access config, so we provide publicPath
    publicPath: config.output.publicPath,

    // These settings suppress noisy webpack output so only errors are displayed to the console.
    noInfo: false,
    quiet: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }

    // for other settings see
    // http://webpack.github.io/docs/webpack-dev-middleware.html
  }));
} else {
  app.use(express.static('dist'));
}

// you express code goes here...

/* eslint-disable no-console */
console.log(chalkSuccess('Express server is listening on port: ' + server.address().port));
