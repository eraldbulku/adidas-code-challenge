require('dotenv').config();
import config from './config';
import HttpServer from './HttpServer';
import mongoose from 'mongoose';
import blubirdPromiseLib from 'bluebird';
import Database from './database';

mongoose.Promise = blubirdPromiseLib;

Database.init();
const httpServer = new HttpServer(config.serverPort);
httpServer.init();
