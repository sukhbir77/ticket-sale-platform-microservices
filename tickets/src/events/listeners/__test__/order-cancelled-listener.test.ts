import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@singtickets/common";

import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticktet";
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    // Create a instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    // Create and save a ticket
    const ticket = Ticket.build({
        title: "Concert",
        price: 99,
        userId: "asdf"
    });

    ticket.set({ orderId });
    await ticket.save();

    // Create the fake data event
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, ticket, listener, orderId, msg }
}

it("updates the ticket, publishes an event and acks the message", async () => {
    const { listener, ticket, data, orderId, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(undefined);
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})  