import { mongoose, Schema } from 'mongoose';

const orderShema = new Schema({
    user: new Schema({
        name: { type: String, required: true },
        email: { type: String, required: true }
    }),
    timestamp: { type: Date, default: Date.now },
    products: [new Schema({
        product: {
            _id: { type: Schema.Types.ObjectId, required: true },
            timestamp: { type: Date, default: Date.now },
            name: { type: String, required: true },
            description: { type: String, required: true },
            cathegory: {
                id: { type: Number, required: true },
                name: { type: String, required: true }
            },
            image: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            stock: { type: Number, required: true }
        },
        quantity: { type: Number, required: true }
    }, { _id: false })
    ]
});

export default mongoose.model('Order', orderShema);