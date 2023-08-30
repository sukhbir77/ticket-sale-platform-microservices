import request from "supertest";
import { app } from "../../app";

import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";

it("returns all the orders associated with the particular user.", async () => {
    // Create Three Tickets
    const ticket1 = Ticket.build({
        title: "Concert",
        price: 13
    })

    const ticket2 = Ticket.build({
        title: "Eminem",
        price: 231
    })

    const ticket3 = Ticket.build({
        title: "J-Cole",
        price: 421
    })

    await ticket1.save();
    await ticket2.save();
    await ticket3.save();

    const userOne = global.signin();
    const userTwo = global.signin();

    // Create one order as User #1
    await request(app)
        .post("/api/orders")
        .set("Cookie", userOne)
        .send({ ticketId: ticket1.id })
        .expect(201)

    // Create two Orders as User #2
    const { body: orderOne } = await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ ticketId: ticket2.id })
        .expect(201)

    const { body: orderTwo } = await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ ticketId: ticket3.id })
        .expect(201)

    // Make Request to get orders for User #2
    const response = await request(app)
        .get("/api/orders")
        .set("Cookie", userTwo)
        .expect(200)

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
})  