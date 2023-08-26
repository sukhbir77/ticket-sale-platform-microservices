import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id doesn't exists", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "Concert",
            price: 20
        })
        .expect(404);
})

it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets${id}`)
        .send({
            title: "Concert",
            price: 20
        })
        .expect(404);
})

it("returns a 401 if the user doesn't own the ticket", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "Concert",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", global.signin())
        .send({
            title: "Eminem",
            price: 12
        })
        .expect(401);
})

it("returns 400 if the user provides a invalid title or price", async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "Concert",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            price: 20
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "Eminem",
            price: -10
        })
        .expect(400)
})

it("updates the ticket provided valid inputs ", async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "Concert",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "New Title",
            price: 100
        })
        .expect(200);

    const ticket = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({})

    expect(ticket.body.title).toEqual("New Title")
    expect(ticket.body.price).toEqual(100)
})

it("Publishes an event", async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "Concert",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "New Title",
            price: 100
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})