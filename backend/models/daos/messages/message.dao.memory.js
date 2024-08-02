import MemoryClass from "../repositories/MemoryClass.js";

let messageInstance = null;

class MessageDaoMemory extends MemoryClass {
    /* Get all messages from one user */
    getAllByEmail(email) {
        try {
            const userMessages = this.array.filter(m => m.email === email);
            return userMessages;
        }
        catch (e) {
            console.log('❌ Error searching user messages in DB ❌\n' + e);
        }
    }

    // Simpleton schema for class
    static getInstance() {
        if (!messageInstance) {
            messageInstance = new MessageDaoMemory();
        }
        return messageInstance;
    }
}

export default MessageDaoMemory;