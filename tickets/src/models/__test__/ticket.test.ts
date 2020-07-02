import {Ticket} from "../tickets";

it('implements optimistic concurrency control', async (done) => {

    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20,
        userId: '123'
    });

    // Save the ticket to the databae
    await ticket.save();

    // Fetch ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make two separate changes
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});

    // Save the first ticket
    await firstInstance!.save();

    // Save the second ticket --> expect an error
    try {
        await secondInstance!.save();
    } catch(err) {
        return done();
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20,
        userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
    await ticket.save();
    expect(ticket.version).toEqual(3);
});