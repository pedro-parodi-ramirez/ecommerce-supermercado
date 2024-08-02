import { mongoose, Schema } from 'mongoose';

const productShema = new Schema({
    timestamp: { type: Date, default: Date.now },
    name: { type: String, required: true },
    description: { type: String, required: true },
    cathegory: {
        id: { type: Number, required: true },
        name: { type: String, required: true }
    },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
});

export default mongoose.model('Product', productShema);