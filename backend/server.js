const express = require('./../node_modules/express')
const request = require('./../node_modules/request')
const path = require('path')

const sso = require('./../node_modules/eve-sso-simple')

const server = express()
const port = 3001;

var accessToken = 0;
var characterId = "None";
var characterName = "None"

// require('./routes')(server, {});

server.use(express.static(__dirname + '/public'))

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

server.get('/getCharacters', (req, res) => {
    var data = {
        "ID":characterId,
        "Name":characterName
    }
    res.send(data)
})

server.get('/getItems', (req, res) => {
    var address = "https://esi.evetech.net/latest/characters/" + characterId + "/assets/?datasource=tranquility&page=1&token=" + accessToken
    request.get({
        url: address
    }, (err, response, responseBody) => {
        if (err) {
            return console.log("ERROR: \n" + err)
        } else {
            res.send(JSON.parse(responseBody))
        }
    })
});

server.get('/login', (req, res) => {
    res.send('This is the login endpoint')
    console.log('This is the login endpoint')
});

server.get('/callback', (req, res) => {
    console.log("Auth Code: " + req.query.code)
    var body = {
        "grant_type":"authorization_code",
        "code":req.query.code
    }
    var bodyJSONString = JSON.stringify(body)
    var AuthHeader = 'Basic NTY4YWJhYjdiYTRkNDc4NWI1YjE2NWRiNTUwOTUyYWM6N2RBMjFHdDN3ZlhJWE1ESDBLbXkwbzU0aExFYU1lUDF0NGpPM3FiNw=='

    request.post({
        url: 'https://login.eveonline.com/oauth/token',
        body: bodyJSONString,
        headers: {'Content-Type':'application/json', 'Authorization':AuthHeader}
    },  (err, response, responseBody) => {
        if (err) {
            return console.log("Recieved Error:\n" + err)
        } else {
            console.log("Received status code: %d", response.statusCode)
            console.log(JSON.parse(responseBody))
            accessToken = JSON.parse(responseBody).access_token
            console.log(accessToken)
            request.get({
                url: 'https://login.eveonline.com/oauth/verify',
                headers: {'Authorization':'Bearer ' + accessToken}
            }, (err, response, responseBody) => {
                if (err) {
                    return console.log("Problem with getting Char Name: \n" + err)
                } else {
                    var responseBody = JSON.parse(responseBody)
                    characterId = responseBody.CharacterID
                    characterName = responseBody.CharacterName
                    res.redirect('/')
                }
            })
        }
    })
});

server.get('/hello', (req, res) => {
    res.redirect('/')
})

server.listen(port, () => {
    console.log("Running on Port " + port)
})
