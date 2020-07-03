import express, {Request, Response} from 'express';
import { Ticket } from "../models/tickets";

const router = express();

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({
        orderId: undefined // All the tickets that are not ordered
    });

    res.send(tickets);
});

export {router as indexTicketRouter};