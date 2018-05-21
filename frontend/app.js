const express = require('./../node_modules/express')
const path = require('path')

const server = express()
const port = 3000;

server.use(express.static('/public'))

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

// server.use(express.static('./'))

server.listen(port, () => {
    console.log("Running on Port " + port)
})