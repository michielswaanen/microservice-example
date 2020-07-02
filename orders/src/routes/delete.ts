import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import { NotAuthorizedError, NotFoundError } from "@tickets-ms/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
    const {orderId} = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if(!order) {
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id     // order.ticket is not an id, it's a ref. Tt must be populated to get the id
        }
    })

    res.status(204).send(order);
});

export { router as deleteOrderRouter };