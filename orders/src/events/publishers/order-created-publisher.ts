import { OrderCreatedEvent, Publisher, Subjects } from "@tickets-ms/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}