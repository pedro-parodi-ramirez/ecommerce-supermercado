import { mongoose, Schema } from 'mongoose';

const messageSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    type: { type: String, required: true },
    email: { type: String, required: true, index: true, validate: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/ },
    body: { type: String, required: true }
});

export default mongoose.model('Message', messageSchema);