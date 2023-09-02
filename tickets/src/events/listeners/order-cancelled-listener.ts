import { Listener, OrderCancelledEvent, OrderCreatedEvent, Subjects } from "@singtickets/common";
import { Ticket } from "../../models/ticktet";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // Find the ticket that the order is cancelling
        const ticket = await Ticket.findById(data.ticket.id);

        // If no ticket, throw error
        if (!ticket) {
            throw new Error("Ticket Not Found")
        }

        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: undefined })

        // Save the Ticket
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId
        });

        // ack the message
        msg.ack();
    }

}