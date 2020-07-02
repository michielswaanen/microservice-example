import mongoose from 'mongoose'
import { Order, OrderStatus } from "./order";
import { BadRequestError } from "@tickets-ms/common";

interface TicketAttributes {
    title: string;
    price: number;
}

export interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    isReserved() : Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attrs: TicketAttributes): TicketDocument;
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
})

ticketSchema.statics.build = (attrs: TicketAttributes) => {
    return new Ticket(attrs);
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