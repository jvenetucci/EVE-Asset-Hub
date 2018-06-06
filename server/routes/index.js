const route = require('./route.js');

module.exports = function(server, db) {
  server.get('/bye', (req, res) => {
    res.send('Bye!')
  });
};