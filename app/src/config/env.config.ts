// import * as dotenv from 'dotenv';
import * as env from 'env-var';
const dotenv = require('dotenv');

import {Int} from "../generated/prisma-client";
/*
const path = require('path');
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '.env') });
*/
 dotenv.config();
// const ENDPOINT: string = env.get('PRISMA_ENDPOINT').required().asUrlString();
const ENDPOINT: string = "http://localhost:4477";
const PORT: string = "4011";
// const PORT = env.get('SERVER_PORT').required().asString();
const API_SECRET = env.get('PRISMA_MANAGEMENT_API_SECRET').asString();
const APP_PRIVATE_KEY = env.get('APP_PRIVATE_KEY').asString();
//const APP_PRIVATE_KEY = "private-key";
const VAPID_PUBLIC_KEY = env.get('VAPID_PUBLIC_KEY').asString();
const VAPID_PRIVATE_KEY = env.get('VAPID_PRIVATE_KEY').asString();
const TOKEN_EXPIRY_TIME = env.get('TOKEN_EXPIRY_TIME').asString();
const DEBUG = env.get('DEBUG').asBool();
const ALLOW_INTROSPECTION = env.get('ALLOW_INTROSPECTION').asBool();
const PLAYGROUND = env.get('PLAYGROUND').asBool();
const TASK_TICK_INTERVAL_MS = env.get('TASK_TICK_INTERVAL_MS').asIntPositive();
const CORS_ORIGIN = env.get('CORS_ORIGIN').asString();
const SERVER_PROXY = env.get('SERVER_PROXY').asString();

// const ENDPOINT: string = process.env.PRISMA_ENDPOINT;
// const PORT: string = "4011";
// // const PORT = env.get('SERVER_PORT').required().asString();
// const API_SECRET = process.env.PRISMA_MANAGEMENT_API_SECRET;
// const APP_PRIVATE_KEY: string  = process.env.APP_PRIVATE_KEY;
// //const APP_PRIVATE_KEY = "private-key";
// const VAPID_PUBLIC_KEY: string  = process.env.VAPID_PUBLIC_KEY;
// const VAPID_PRIVATE_KEY: string  = process.env.VAPID_PRIVATE_KEY;
// const TOKEN_EXPIRY_TIME: string  = process.env.TOKEN_EXPIRY_TIME;
// const DEBUG  = Boolean(process.env.DEBUG);
// const ALLOW_INTROSPECTION = Boolean(process.env.ALLOW_INTROSPECTION);
// const PLAYGROUND  = Boolean(process.env.PLAYGROUND);
// const TASK_TICK_INTERVAL_MS  = parseInt(process.env.TASK_TICK_INTERVAL_MS);
// const CORS_ORIGIN: string  = process.env.CORS_ORIGIN;
// const SERVER_PROXY: string  = process.env.SERVER_PROXY;

export {
  ENDPOINT,
  PORT,
  //API_SECRET,
  APP_PRIVATE_KEY,
  VAPID_PRIVATE_KEY,
  VAPID_PUBLIC_KEY,
  TOKEN_EXPIRY_TIME,
  DEBUG,
  ALLOW_INTROSPECTION,
  PLAYGROUND,
  TASK_TICK_INTERVAL_MS,
  CORS_ORIGIN,
  SERVER_PROXY,
}
