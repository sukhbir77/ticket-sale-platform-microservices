import { Publisher, Subjects, OrderCreatedEvent } from "@singtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated
}