import request from "supertest"
import { app } from "../../app"

import { Ticket } from "../../models/ticket"
import { Order } from "../../models/order"

it("fetches an order requested by the user", async () => {
    const ticket = Ticket.build({
        title: "Eminem",
        price: 341
    });

    await ticket.save();

    const user = global.signin()

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    const { body: fetchOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200)

    expect(fetchOrder.id).toEqual(order.id);
})

it("returns an error if the one user tries to fetch other user's order", async () => {
    const ticket = Ticket.build({
        title: "Eminem",
        price: 341
    });

    await ticket.save();

    const user = global.signin()

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", global.signin())
        .send()
        .expect(401)
})