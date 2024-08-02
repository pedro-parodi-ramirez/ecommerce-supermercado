import mongoose from 'mongoose';
import { config } from '../../../config/config.js';

export async function initMongoDB() {
  try {
    await mongoose.connect(config.MONGODB.URI);
    console.log('Database connected.')
  } catch (error) {
    console.error('Error to connecto to database', error.message)
  }
}

export default class MongoDBClass {
  constructor(model) {
    this.collection = model;
  }

  /* Return all elements */
  async getAll() {
    try {
      const array = await this.collection.find({});
      return array;
    }
    catch (e) {
      throw new Error('❌ Error searching in DB ❌\n' + e);
    }
  }

  /* Search element based on ID */
  async getById(id) {
    try {
      const element = await this.collection.findById({ _id: id });
      return element;
    }
    catch (e) {
      throw new Error('❌ Error searching by ID in DB ❌\n' + e);
    }
  }

  /* Add element */
  async create(data) {
    try {
      const response = await this.collection.create(data);
      return response;
    }
    catch (e) {
      throw new Error('❌ Error adding to DB ❌\n' + e);
    }
  }

  /* Update based on ID */
  async update(id, data) {
    try {
      // Update element if it exists
      const response = await this.collection.updateOne({ _id: id }, { $set: data });
      return response.modifiedCount;
    }
    catch (e) {
      throw new Error('❌ Error updating in DB ❌\n' + e);
    }
  }

  /* Delete element based on ID */
  async deleteOne(id) {
    try {
      // Delete element if it exists
      const response = await this.collection.deleteOne({ _id: id });
      return response.deletedCount;
    }
    catch (e) {
      throw new Error('❌ Error deleting from DB ❌\n' + e);
    }
  }
}