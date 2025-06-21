const mongoose = require('mongoose');

class BaseModel {
    constructor(schema, modelName) {
        this.schema = schema;
        this.modelName = modelName;
        
        // Add timestamps to all models
        this.schema.set('timestamps', true);
        
        // Add toJSON transform to remove __v and handle _id
        this.schema.set('toJSON', {
            transform: function(doc, ret, options) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        });
        
        // Add toObject transform
        this.schema.set('toObject', {
            transform: function(doc, ret, options) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        });
    }
    
    // Get model instance
    getModel() {
        return mongoose.model(this.modelName, this.schema);
    }
    
    // Static methods for common operations
    static async findById(model, id) {
        try {
            return await model.findById(id);
        } catch (error) {
            throw new Error(`Error finding ${model.modelName} by ID: ${error.message}`);
        }
    }
    
    static async findOne(model, query) {
        try {
            return await model.findOne(query);
        } catch (error) {
            throw new Error(`Error finding ${model.modelName}: ${error.message}`);
        }
    }
    
    static async find(model, query = {}, options = {}) {
        try {
            return await model.find(query, null, options);
        } catch (error) {
            throw new Error(`Error finding ${model.modelName}s: ${error.message}`);
        }
    }
    
    static async create(model, data) {
        try {
            const instance = new model(data);
            return await instance.save();
        } catch (error) {
            throw new Error(`Error creating ${model.modelName}: ${error.message}`);
        }
    }
    
    static async update(model, id, data, options = { new: true }) {
        try {
            return await model.findByIdAndUpdate(id, data, options);
        } catch (error) {
            throw new Error(`Error updating ${model.modelName}: ${error.message}`);
        }
    }
    
    static async delete(model, id) {
        try {
            return await model.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting ${model.modelName}: ${error.message}`);
        }
    }
}

module.exports = BaseModel; 