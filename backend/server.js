const express = require('./../node_modules/express')


const server = express()
const port = 3000;

require('./routes')(server, {});
server.listen(port, () => {
    console.log("Running on Port " + port)
})
