// const db = require('../models');
// const { Op } = require('sequelize');
// const { omit } = require('lodash');
module.exports = async (app, db) => {
  app.get('/ping', async (req, res) => {
    try {
      return res.json({payload: 'response'});
    } catch (e) {
      return res.json({'payload': {status: 'error'}});
    }
  });
};