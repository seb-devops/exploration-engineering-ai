import createError from 'http-errors';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import helmet from 'helmet';
import compression from 'compression';
import cors, { type CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';
import { requireApiKey } from './middleware/api-key-auth.js';

import indexRouter from './routes/index.js';
import analyzerRouter from './routes/analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Application = express();
const trustProxySetting = process.env.TRUST_PROXY ?? 'loopback, linklocal, uniquelocal';
app.set('trust proxy', trustProxySetting);
app.disable('x-powered-by');

const viewsPath = path.join(process.cwd(), 'views');
const publicPath = path.join(process.cwd(), 'public');
const corsOrigins = process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()).filter(Boolean);
const corsOptions: CorsOptions = {
  origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : undefined,
  credentials: true,
};
const bodySizeLimit = process.env.BODY_LIMIT ?? '1mb';
const rateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
  limit: Number(process.env.RATE_LIMIT_MAX ?? 100),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      status: 429,
      message: 'Too many requests, slow down and try again later.',
    },
  },
});

// view engine setup
app.set('views', viewsPath);
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(helmet({
  contentSecurityPolicy: app.get('env') === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(cors(corsOptions));
app.use(rateLimiter);
app.use(express.json({ limit: bodySizeLimit }));
app.use(express.urlencoded({ extended: false, limit: bodySizeLimit }));
app.use(cookieParser());
app.use(express.static(publicPath));

app.use('/', indexRouter);
app.use('/analyze', requireApiKey, analyzerRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // API error handler - return JSON instead of rendering views
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error for debugging
  console.error('Error:', {
    status,
    message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Return JSON error response
  res.status(status).json({
    error: {
      status,
      message,
      ...(req.app.get('env') === 'development' && { 
        stack: err.stack,
        details: err 
      })
    }
  });
});

export default app;

