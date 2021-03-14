module.exports = async (app, db) => {
  app.get('/ping', async (req, res) => {
    try {
      return res.status(200).send('The service is up and running.');
    } catch (err) {
      console.error(err);
      return res.status(err.status).send(err.message);
    }
  });
};