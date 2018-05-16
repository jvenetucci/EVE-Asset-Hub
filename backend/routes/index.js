const route = require('./route.js');

module.exports = function(server, db) {
  route(server, db);
};