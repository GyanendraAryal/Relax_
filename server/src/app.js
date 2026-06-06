import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import * as Sentry from '@sentry/node';
import env from './config/env.js';
import logger from './utils/logger.js';
import routes from './routes/index.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
}

const app = express();

app.set('trust proxy', 1);

app.use(
  cors({
    origin: env.CLIENT_URLS,
    credentials: true,
  })
);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  pinoHttp({
    logger,
    autoLogging: env.NODE_ENV !== 'test',
  })
);

app.use('/api', apiLimiter, routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
