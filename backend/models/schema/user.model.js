import { mongoose, Schema } from 'mongoose';

const userSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    name: { type: String, required: true },
    email: { type: String, require: true, unique: true, index: true, validate: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/ },
    password: { type: String, required: true },
    age: { type: Number },
    address: { type: String },
    telephone: { type: String },
    avatar: { type: String },
    admin: { type: Number, default: 0 }
});

export default mongoose.model('User', userSchema);