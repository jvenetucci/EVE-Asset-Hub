module.exports = function(server, db) {
    server.get('/callback', (req, res) => {
        res.send('This is the callback endpoint')
      });
};