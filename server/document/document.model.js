const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Document Schema
 */
const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contents: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
DocumentSchema.method({
});

/**
 * Statics
 */
DocumentSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of document.
   * @returns {Promise<Document, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((document) => {
        if (document) {
          return document;
        }
        const err = new APIError('No such document exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of documents to be skipped.
   * @param {number} limit - Limit number of documents to be returned.
   * @returns {Promise<Document[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Document
 */
module.exports = mongoose.model('Document', DocumentSchema);
