import express from 'express';
import 'express-async-errors';

import { json } from 'body-parser';

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";
import { errorHandler, NotFoundError } from "@tickets-ms/common";
import cookieSession from "cookie-session";

const app = express();
app.set('trust proxy', true); // Allows connection with the ClusterIP
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false // process.env.NODE_ENV !== 'test'
}));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export default app;