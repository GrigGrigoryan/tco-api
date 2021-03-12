const Utils = require('../core/Utils');

module.exports = async (app, db) => {
  app.get('/balance/:account_id', async (req, res) => {
    try {
      const { account_id }  = req.params;
      if (!account_id) {
          throw 'account_id not provided';
      }

      let account = await db.account.findOne({where: account_id, raw: true});
      if (!account) {
          throw `Account with uuid: ${account_id} not found`;
      }

      return res.json({
        status: 'success',
        data: account
      });
    } catch (err) {
      return res.json({
        status: 'error',
        message: err
      });
    }
  });

  app.get('/max_transaction_volume', async (req, res) => {
    try {
      const {  } = req.body;


      res.send({
        status: 'success',
      });
    } catch (err) {
      res.send({
        status: 'error',
        message: err
      });
    }
  });
};