import { Publisher, Subjects, TicketCreatedEvent } from "@tickets-ms/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}

