import { PaymentCreatedEvent, Publisher, Subjects } from "@tickets-ms/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}