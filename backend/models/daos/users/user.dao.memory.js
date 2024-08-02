import MemoryClass from '../repositories/MemoryClass.js';
import { v4 as uuid4 } from 'uuid';
import { encryptPassword } from '../../../utils/bcrypt.js';

let userInstance = null;

class UserDaoMemory extends MemoryClass {
    // Override add element - set default avatar in case there isn't any
    create(data) {
        try {
            (!data.avatar) && (data.avatar = '/image/avatar/default.png');
            const newUser = {
                _id: uuid4(),
                ...data
            }
            this.array.push(newUser);
            return newUser;
        }
        catch (e) {
            throw new Error('❌ Error adding to DB ❌\n' + e);
        }
    }

    /* Get user by email */
    getByEmail(email) {
        try {
            const userRequested = this.array.find(u => u.email === email);
            return userRequested;
        }
        catch (e) {
            console.log('❌ Error searching by email in DB ❌\n' + e);
        }
    }

    /* Init 2 users: one admin, one random */
    initUsers() {
        this.array = [];
        users.forEach(u => userInstance.create(u));
    }

    // Simpleton schema for class
    static getInstance() {
        if (!userInstance) {
            userInstance = new UserDaoMemory();
        }
        return userInstance;
    }
}

export default UserDaoMemory;

let users = [
    {
        name: "admin",
        email: "admin@gmail.com",
        password: encryptPassword('admin'),
        age: "39",
        address: "Esmeralda 1027. Buenos Aires, Argentina.",
        avatar: '/image/avatar/admin.png',
        admin: 1
    },
    {
        name: "Marcos Alvarez",
        email: "marcosa@gmail.com",
        password: encryptPassword('marcosa'),
        admin: 0
    }
];