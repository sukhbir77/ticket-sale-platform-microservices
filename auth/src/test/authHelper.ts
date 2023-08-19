import { app } from "../app";
import request from "supertest";

export const getCookie = async () => {
    const email = "test@test.com"
    const password = "password"

    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email, password
        })
        .expect(202)

    const cookie = response.get("Set-Cookie");

    return cookie;
}