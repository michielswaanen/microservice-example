import { ExpirationCompleteEvent, Publisher, Subjects } from "@tickets-ms/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;

}