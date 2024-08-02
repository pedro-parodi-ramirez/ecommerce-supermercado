import MongoDBClass from '../repositories/MongoDBClass.js';
import userModel from '../../schema/user.model.js';

let userInstance = null;

class UserDaoMongoDB extends MongoDBClass {
    constructor() { super(userModel); }

    /* Override add element - set default avatar in case there isn't any*/
    async create(data) {
        try {
            (!data.avatar) && (data.avatar = '/image/avatar/default.png');
            const response = await this.collection.create(data);
            return response;
        }
        catch (e) {
            throw new Error('❌ Error adding to DB ❌\n' + e);
        }
    }

    /* Get user by email */
    async getByEmail(email) {
        try {
            const element = await this.collection.findOne({ email });
            return element;
        }
        catch (e) {
            console.log('❌ Error searching by email in DB ❌\n' + e);
        }
    }

    // Simpleton schema for class
    static getInstance() {
        if (!userInstance) {
            userInstance = new UserDaoMongoDB();
        }
        return userInstance;
    }
}

export default UserDaoMongoDB;