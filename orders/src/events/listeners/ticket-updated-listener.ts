import { Listener, Subjects, TicketUpdatedEvent } from "@tickets-ms/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Assign the version of an updated object (from of another service)
        // to the document replica in this service.
        // Also update title and price..
        const { title, price, version } = data;
        ticket.set({ title, price, version });
        await ticket.save();

        msg.ack();
    }
}