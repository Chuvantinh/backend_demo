// import * as dotenv from 'dotenv';
import * as env from 'env-var';
const dotenv = require('dotenv');

dotenv.config();
const ENDPOINT: string = env.get('PRISMA_ENDPOINT').required().asUrlString();
//const ENDPOINT: string = "http://localhost:4477";
const PORT = env.get('SERVER_PORT').required().asString();
// const API_SECRET = env.get('PRISMA_MANAGEMENT_API_SECRET').asString();
const APP_PRIVATE_KEY = env.get('APP_PRIVATE_KEY').asString();
const VAPID_PUBLIC_KEY = env.get('VAPID_PUBLIC_KEY').asString();
const VAPID_PRIVATE_KEY = env.get('VAPID_PRIVATE_KEY').asString();
const TOKEN_EXPIRY_TIME = env.get('TOKEN_EXPIRY_TIME').asString();
const DEBUG = env.get('DEBUG').asBool();
const ALLOW_INTROSPECTION = env.get('ALLOW_INTROSPECTION').asBool();
const PLAYGROUND = env.get('PLAYGROUND').asBool();
const TASK_TICK_INTERVAL_MS = env.get('TASK_TICK_INTERVAL_MS').asIntPositive();
const CORS_ORIGIN = env.get('CORS_ORIGIN').asString();
const SERVER_PROXY = env.get('SERVER_PROXY').asString();

export {
  ENDPOINT,
  PORT,
  // API_SECRET,
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
