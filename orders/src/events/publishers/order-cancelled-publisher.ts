import { Publisher, Subjects, OrderCancelledEvent } from "@singtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled
}