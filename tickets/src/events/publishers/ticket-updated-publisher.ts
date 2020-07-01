import { Publisher, Subjects, TicketUpdatedEvent } from "@tickets-ms/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}

