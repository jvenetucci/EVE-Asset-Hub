module.exports = function(server) {
    server.get('/hello', (req, res) => {
        res.send('Hello!')
    });
};