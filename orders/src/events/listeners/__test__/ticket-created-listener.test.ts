import { TicketCreatedEvent } from "@singtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // Create a instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // Create a fake data Event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: "Concert",
        price: 123,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { data, listener, msg }
}

it("creates and saves a ticket", async () => {
    const { listener, data, msg } = await setup();

    // Call onMessage function with the  data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title)

})

it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    // Call onMessage function with the  data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure ack function was called.
    expect(msg.ack).toHaveBeenCalled();
})