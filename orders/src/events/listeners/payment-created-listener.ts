import { Listener, NotFoundError, OrderStatus, PaymentCreatedEvent, Subjects } from "@tickets-ms/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if(!order) {
            throw new NotFoundError();
        }

        order.set({
            status: OrderStatus.Complete
        });
        await order.save();

        // TODO Publish OrderUpdatedEvent (should be done, not done in the course)

        msg.ack();
    }
}