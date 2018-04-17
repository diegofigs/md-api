const Document = require('./document.model');

/**
 * Load document and append to req.
 */
function load(req, res, next, id) {
  // noinspection JSUnresolvedFunction
  Document.get(id)
    .then((document) => {
      req.document = document; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get document
 * @returns {Document}
 */
function get(req, res) {
  return res.json(req.document);
}

/**
 * Create new document
 * @property {string} req.body.name - The name of document.
 * @property {string} req.body.contents - The contents of document.
 * @returns {Document}
 */
function create(req, res, next) {
  const document = new Document({
    name: req.body.name,
    contents: req.body.contents
  });

  // noinspection JSUnresolvedFunction
  document.save()
    .then(savedDoc => res.json(savedDoc))
    .catch(e => next(e));
}

/**
 * Update existing document
 * @property {string} req.body.name - The name of document.
 * @property {string} req.body.contents - The contents of document.
 * @returns {Document}
 */
function update(req, res, next) {
  const document = req.document;
  document.name = req.body.name;
  document.contents = req.body.contents;

  document.save()
    .then(savedDoc => res.json(savedDoc))
    .catch(e => next(e));
}

/**
 * Get document list.
 * @property {number} req.query.skip - Number of documents to be skipped.
 * @property {number} req.query.limit - Limit number of documents to be returned.
 * @returns {Document[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  // noinspection JSUnresolvedFunction
  Document.list({ limit, skip })
    .then(documents => res.json(documents))
    .catch(e => next(e));
}

/**
 * Delete document.
 * @returns {Document}
 */
function remove(req, res, next) {
  const document = req.document;
  document.remove()
    .then(deletedDoc => res.json(deletedDoc))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
