const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const docCtrl = require('./document.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/documents - Get list of documents */
  .get(docCtrl.list)

  /** POST /api/documents - Create new document */
  .post(validate(paramValidation.createDoc), docCtrl.create);

router.route('/:docId')
  /** GET /api/documents/:docId - Get document */
  .get(docCtrl.get)

  /** PUT /api/documents/:docId - Update document */
  .put(validate(paramValidation.updateDoc), docCtrl.update)

  /** DELETE /api/documents/:userId - Delete document */
  .delete(docCtrl.remove);

/** Load document when API with docId route parameter is hit */
router.param('docId', docCtrl.load);

module.exports = router;
