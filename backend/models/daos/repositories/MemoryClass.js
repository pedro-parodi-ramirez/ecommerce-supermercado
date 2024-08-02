import { v4 as uuid4 } from 'uuid';

export default class MemoryClass {
    constructor(initArray = []) {
        this.array = initArray;
    }
    /* Return all elements */
    getAll() {
        try {
            return this.array;
        }
        catch (e) {
            throw new Error('❌ Error searching in DB ❌\n' + e);
        }
    }

    /* Search element based on ID */
    getById(id) {
        try {
            const elementRequested = this.array.find(e => e._id === id);
            return elementRequested;
        }
        catch (e) {
            throw new Error('❌ Error searching by ID in DB ❌\n' + e);
        }
    }

    /* Add element */
    create(data) {
        try {
            const newElement = {
                _id: uuid4(),
                ...data
            }
            this.array.push(newElement);
            return newElement;
        }
        catch (e) {
            throw new Error('❌ Error adding to DB ❌\n' + e);
        }
    }

    /* Update based on ID */
    update(id, data) {
        try {
            let modifiedCount = 0;
            // Update element if it exists
            this.array = this.array.map(e => {
                if (e._id === id) {
                    e = {
                        _id: id,
                        ...data
                    }
                    modifiedCount++;
                }
                return e;
            });
            return modifiedCount;
        }
        catch (e) {
            throw new Error('❌ Error updating in DB ❌\n' + e);
        }
    }

    /* Delete element based on ID */
    deleteOne(id) {
        try {
            let deletedCount = 0;

            // Check if element exist
            let found = this.array.some(e => e._id === id);
            if (found) {
                if (this.array.length === 1) {
                    this.array = [];
                    deletedCount = 1;
                }
                else {
                    this.array = this.array.filter(e => {
                        if (e._id !== id) { return e }
                        else { deletedCount++; }
                    })
                }
            }
            return deletedCount;
        }
        catch (e) {
            throw new Error('❌ Error deleting from DB ❌\n' + e);
        }
    }
}