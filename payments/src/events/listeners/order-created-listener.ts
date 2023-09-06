import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@singtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated;
    queueGroupName = "payments-service";

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            version: data.version,
            userId: data.userId,
            status: data.status,
            price: data.ticket.price
        });

        await order.save();

        msg.ack();
    }
}