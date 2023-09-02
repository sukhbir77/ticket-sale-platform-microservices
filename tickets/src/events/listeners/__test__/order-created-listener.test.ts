import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@singtickets/common";

import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticktet";

const setup = async () => {
    // Create a instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        title: "Concert",
        price: 99,
        userId: "asdf"
    });

    await ticket.save();

    // Create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: "129311",
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, ticket, listener, msg }
}

it("sets the orderId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();

    // Call onMessage function with the  data object + message object
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);

})

it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    // Call onMessage function with the  data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure ack function was called.
    expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(ticketUpdatedData.orderId).toEqual(data.id);
})