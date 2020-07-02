import { OrderCancelledEvent, Publisher, Subjects } from "@tickets-ms/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}