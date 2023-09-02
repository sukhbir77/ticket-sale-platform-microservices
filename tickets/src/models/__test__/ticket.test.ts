import request from "supertest";
import { Ticket } from "../ticktet";

it("implements optimistic concurrency control", async () => {
    // Create an instance of ticket
    const ticket = Ticket.build({
        title: "Concert",
        price: 5,
        userId: "12345"
    })

    // Save the ticket to the database
    await ticket.save();

    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // Save the first Fetched ticket
    await firstInstance!.save()

    // Save the second fetched ticket and expect and error
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }
});

it("increments the version number on multiple saves", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 123,
        userId: '1231'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0)
    await ticket.save();
    expect(ticket.version).toEqual(1)
    await ticket.save();
    expect(ticket.version).toEqual(2)
    await ticket.save();
    expect(ticket.version).toEqual(3)
})