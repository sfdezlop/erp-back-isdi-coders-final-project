import path from 'path';
import { __dirname } from './config.js';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { usersRouter } from './routers/users.router.js';
import createDebug from 'debug';
import { CustomError } from './interfaces/error.js';
import { productsRouter } from './routers/products.router.js';
import { productMovementsRouter } from './routers/productmovements.router.js';
import fs from 'fs';

import { collectionsRouter } from './routers/collections.router.js';

const debug = createDebug('ERP:app');
export const app = express();

app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
// Morgan allows you to create your own tokens with the .token() method
// See node_modules\morgan\index.js

morgan.token('userLoggedToken', (req, res) =>
  req.headers.authorization === undefined
    ? 'No Token'
    : req.headers.authorization
);

morgan.token(
  'userHost',
  (req, res) => req.headers.host ?? 'No host'
  // Nullish coalescing operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
);

export const morganStream = app.use(
  morgan(
    (tokens, req, res) =>
      [
        tokens.date(req, res, 'iso'),
        tokens.userLoggedToken(req, res),

        tokens.userHost(req, res),

        tokens.method(req, res),

        tokens.url(req, res),

        tokens.status(req, res),

        tokens.res(req, res, 'content-length'),

        tokens['response-time'](req, res),
      ].join('_-_'),

    // To save the log in dist/access.log
    {
      stream: fs.createWriteStream(path.join(__dirname, 'access.log')),
    }
  )
);

app.use(express.json());
app.use(cors(corsOptions));

// Code to be implemented for statics content
// debug({ __dirname });
// app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/productmovements', productMovementsRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/collections', collectionsRouter);

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Santiago-Fernandez-Final-Project-back-202301-mad',
    endpoints: {
      users: '/users',
      products: '/products',
      productMovements: '/productmovements',
    },
  });
});

app.use(
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    debug('Middleware de errores');
    const status = error.statusCode || 500;
    const statusMessage =
      error.statusMessage || 'Internal server error (default server message)';
    resp.status(status);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
    debug(status, statusMessage, error.message);
  }
);
