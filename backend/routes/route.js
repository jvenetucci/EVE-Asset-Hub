module.exports = function(server, db) {
    server.get('/authorize', (req, res) => {
        res.send('This is the authorize endpoint')
      });
};