import MongoDBClass from "../repositories/MongoDBClass.js";
import messageModel from "../../schema/message.model.js";

let messageInstance = null;

class MessageDaoMongoDB extends MongoDBClass {
    constructor() { super(messageModel); }

    /* Get all messages from one user */
    getAllByEmail(email) {
        try {
            const userMessages = this.collection.find({ email: email });
            return userMessages;
        }
        catch (e) {
            console.log('❌ Error searching user messages in DB ❌\n' + e);
        }
    }

    // Simpleton schema for class
    static getInstance() {
        if (!messageInstance) {
            messageInstance = new MessageDaoMongoDB();
        }
        return messageInstance;
    }
}

export default MessageDaoMongoDB;