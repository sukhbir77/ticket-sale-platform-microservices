import { TicketUpdatedEvent } from "@singtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // Create a instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 1233
    })

    await ticket.save();

    // Create a fake data Event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: "Eminem",
        price: 21,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { data, listener, ticket, msg }
}

it("finds, updates and saves a ticket", async () => {
    const { listener, data, ticket, msg } = await setup();

    // Call onMessage function with the  data object + message object
    await listener.onMessage(data, msg);

    const fetchedTicket = await Ticket.findById(ticket.id);

    expect(fetchedTicket!.title).toEqual(data.title);
    expect(fetchedTicket!.price).toEqual(data.price);
    expect(fetchedTicket!.version).toEqual(data.version);
})

it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    // Call onMessage function with the  data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure ack function was called.
    expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
    const { msg, data, listener, ticket } = await setup();

    data.version = 10;
    try {

        await listener.onMessage(data, msg);
    } catch (err) {

    }

    expect(msg.ack).not.toHaveBeenCalled();
})