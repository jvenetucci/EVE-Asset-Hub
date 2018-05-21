const express = require('./../node_modules/express')
const path = require('path')

const server = express()
const port = 3001;

// require('./routes')(server, {});

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

server.get('/callback', (req, res) => {
    res.send('This is the callback endpoint')
    
});

server.listen(port, () => {
    console.log("Running on Port " + port)
})
