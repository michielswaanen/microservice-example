import mongoose from 'mongoose'

interface OrderAttributes {
    userId: string;
    status: string;
    expiresAt: Date;
    ticket: TicketDocument;
}

interface OrderDocument extends mongoose.Document {
    userId: string;
    status: string;
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
        required: true
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {});

orderSchema.statics.build = (attrs: OrderAttributes) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export { orderSchema };