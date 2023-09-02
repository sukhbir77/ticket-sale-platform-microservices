import { Publisher, ExpirationCompleteEvent, Subjects } from "@singtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete
}