import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from "@singtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { Order } from "../../models/order";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete
    queueGroupName = queueGroupName

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new Error("Order not Found");
        }

        if (order.status !== OrderStatus.Complete) {

            order.set({
                status: OrderStatus.Cancelled
            });

            await order.save();

            new OrderCancelledPublisher(this.client).publish({
                id: data.orderId,
                version: order.version,
                ticket: {
                    id: order.ticket.id
                }
            })
        }

        msg.ack();
    }
}
