import createError from 'http-errors';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import indexRouter from './routes/index.js';
import analyzerRouter from './routes/analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Application = express();

// view engine setup
app.set('views', path.join(process.cwd(), 'agent-falcon/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'agent-falcon/public')));

app.use('/', indexRouter);
app.use('/analyze', analyzerRouter);

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

