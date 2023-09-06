import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@singtickets/common";

import { natsWrapper } from "../../../nats-wrapper"
import { Order } from "../../../models/order";

const setup = async () => {
    // Create a instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: "129311",
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 123
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, listener, msg }
}

it("saves the order to the payments order database and acks the message object.", async () => {
    const { listener, data, msg } = await setup();

    // Call onMessage function with the  data object + message object
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
    expect(msg.ack).toHaveBeenCalled();

});