import { Publisher, Subjects, TicketUpdatedEvent } from "@singtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: TicketUpdatedEvent['subject'] = Subjects.TicketUpdated;
} 