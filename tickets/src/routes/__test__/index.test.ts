import request from "supertest";
import { app } from "../../app";

const createTicket = (title: string, price: number) => {
    return request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title, price
        })
}

it("can fetch a list of tickets", async () => {
    await createTicket("Concert", 21);
    await createTicket("Live Show", 9.99);
    await createTicket("Eminem", 231);

    const response = await request(app).get("/api/tickets").send().expect(200);

    expect(response.body.length).toEqual(3);
})