import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError } from "@tickets-ms/common";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set('trust proxy', true); // Allows connection with the ClusterIP
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export default app;