import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError } from "@tickets-ms/common";
import cookieSession from "cookie-session";
import { createChargeRouter } from "./routes/new";


const app = express();
app.set('trust proxy', true); // Allows connection with the ClusterIP
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false //process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export default app;