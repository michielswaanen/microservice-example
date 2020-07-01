import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@tickets-ms/common";
import { body } from "express-validator";

const router = express.Router();

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('TicketId must be provided')
], validateRequest, async (req: Request, res: Response) => {
    res.send({});
});

export { router as createOrderRouter };