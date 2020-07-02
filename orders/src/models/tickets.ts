import mongoose from 'mongoose'
import { Order, OrderStatus } from "./order";

interface TicketAttributes {
    id: string;
    title: string;
    price: number;
}

// Only used to make sure that typescript doesn't complain
export interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved() : Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attrs: TicketAttributes): TicketDocument;
    findByEvent(event: {id: string, version: number}): Promise<TicketDocument | null>;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');

// Must use function() because the result will be inside of this (keyword)
// An arrow function automatically overwrites the this keyword --> so result will be gone
ticketSchema.pre('save', function (done) {
    // @ts-ignore
    this.$where = {
        version: this.get('version') - 1    // When you update a document inside the ticket model
                                            // it must satisfy 2 conditions
                                            //  1. ID must be equal to the object we want to safe (AUTOMATICALLY, STANDARD BEHAVIOUR)
                                            //  2. Version of the soon-to-be-updated ticket must be equal to the
                                            //      version of the emitted ticket minus 1.
                                            // The emitted ticket has always a higher version than the soon-to-be-updated ticket
    };

    done();
})

ticketSchema.statics.build = (attrs: TicketAttributes) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1   // This function receives data that was send from another service
                                     // where the version is already updated.
                                     // A record is identified by its _id and version
    });
}

ticketSchema.methods.isReserved = async function() {
    const exitingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!exitingOrder;
}

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);

export { Ticket } ;