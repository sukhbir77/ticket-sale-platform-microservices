import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUser, errorHandler, NotFoundError } from '@singtickets/common';
import { createChargeRouter } from './routes/new';

// Create a Express App.
const app = express();

app.set('trust proxy', true);

// Wire up all the config and Routes into our express application.
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);
app.use(createChargeRouter)

// Handler for any route which is undefined.
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
