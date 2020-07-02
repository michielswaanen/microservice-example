import mongoose from 'mongoose'
import { OrderStatus } from "@tickets-ms/common";
import { TicketDocument } from "./tickets";

export { OrderStatus };

interface OrderAttributes {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
}

interface OrderDocument extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attrs: OrderAttributes): OrderDocument
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build = (attrs: OrderAttributes) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export { Order };