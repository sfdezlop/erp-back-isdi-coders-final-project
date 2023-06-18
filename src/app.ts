import jwt from 'jsonwebtoken';
import path from 'path';
import { __dirname, config } from './config.js';
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
import { Auth, PayloadToken } from './services/auth.js';

const debug = createDebug('ERP:app');
export const app = express();

app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
// Morgan allows you to create your own tokens with the .token() method
// See node_modules\morgan\index.js

morgan
  .token(
    'userLoggedToken',
    (req, _res) => req.headers.authorization ?? 'No Token'
  )
  .toString();

// Const payloadOfToken: PayloadToken = Auth.verifyJWTGettingPayload(xx);

morgan.token(
  'userHost',
  (req, _res) => req.headers.host ?? 'No host'
  // Nullish coalescing operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
);

export const morganStream = app.use(
  morgan(
    (tokens, req, res) =>
      [
        JSON.stringify({
          timeStamp: tokens.date(req, res, 'iso'),
          userLoggedToken: tokens.userLoggedToken(req, res),
          userEmail: '',
          userHost: tokens.userHost(req, res),
          method: tokens.method(req, res),
          url: tokens.url(req, res),
          statusCode: tokens.status(req, res),
          responseLength: tokens.res(req, res, 'content-length'),
          responseTimeMs: tokens['response-time'](req, res),
        }),
        ',',
      ].join(''),

    // To save the log in dist/request.log
    {
      // With non relative reference: stream: fs.createWriteStream('request.log'),
      stream: fs.createWriteStream(path.join(__dirname, 'request.log')),
    }
  )
);

app.use(express.json());
app.use(cors(corsOptions));

// Code to be implemented for statics content. It does not work for testing
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
    debug('Middleware of errors');
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
