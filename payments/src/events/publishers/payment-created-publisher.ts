import { PaymentCreatedEvent, Publisher, Subjects } from "@singtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: PaymentCreatedEvent['subject'] = Subjects.PaymentCreated;
}