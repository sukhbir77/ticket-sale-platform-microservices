import request from "supertest"
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@singtickets/common";
import { stripe } from "../../stripe";

// jest.mock("../../stripe");

it("returns 404 when the order doesn't exist", async () => {
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "adfa",
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
})

it("returns a 401 when purchasing an order which doesn't belong to user", async () => {

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 123
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "adfa",
            orderId: order.id
        })
        .expect(401);

})
it("returns 400 when purchasing a cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Cancelled,
        userId,
        price: 123
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(userId))
        .send({
            token: "adfa",
            orderId: order.id
        })
        .expect(400);
});

it("returns a 204 with valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId,
        price: Math.floor(Math.random() * 10000)
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(userId))
        .send({
            token: "tok_visa",
            orderId: order.id
        })
        .expect(201);

    const { data } = await stripe.charges.list({ limit: 50 });

    const stripeCharge = data.find(charge => {
        return charge.amount === order.price * 100
    })

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge?.currency).toEqual('usd');

    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    // expect(chargeOptions.source).toEqual("tok_visa");
    // expect(chargeOptions.amount).toEqual(123 * 100);
    // expect(chargeOptions.currency).toEqual("usd");
})