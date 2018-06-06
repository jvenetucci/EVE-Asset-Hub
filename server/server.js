const express = require('express');
const request = require('request');
const path = require('path');
const axios = require('axios');
// const cors = require('cors')

const server = express();
const port = 3001;

require('./routes/index')(server);
require('./routes/route')(server);

var accessToken = 0;
var characterId = "None";
var characterName = "None";

var characters = {}

server.use(express.static(__dirname + '/public'));
// server.use(cors());

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

server.get('/getCharacters', (req, res) => {
    var data = {
        "ID":characterId,
        "Name":characterName
    }
    res.send(data);
})


server.get('/getItems', (req, res) => {
    var address = "https://esi.evetech.net/latest/characters/" + characterId + "/assets/?datasource=tranquility&page=1&token=" + accessToken
    request.get({
        url: address
    }, (err, response, responseBody) => {
        if (err) {
            return console.log("ERROR: \n" + err)
        } else {
            var itemList = JSON.parse(responseBody);
            // convertItemIDtoNames(itemList);
            res.json(itemList)
        }
    })
});

server.get('/login', (req, res) => {
    // res.redirect('https://login.eveonline.com/oauth/authorize?response_type=code&redirect_uri=http://localhost:3001/callback&client_id=568abab7ba4d4785b5b165db550952ac&scope=characterWalletRead%20characterAssetsRead%20esi-wallet.read_character_wallet.v1%20esi-assets.read_assets.v1')
    // res.send("HELLO")
});

// async function getTokens(AuthCode) {


//     return response.data
// }
server.get('/callback', async (req, res) => {
    // console.log("Auth Code: " + req.query.code)
    // getAccessToken(req.query.code).then(response => {})
    // var x = await getTokens(req.query.code)
    var body = {
        "grant_type":"authorization_code",
        "code":req.query.code
    }

    var AuthHeader = 'Basic NTY4YWJhYjdiYTRkNDc4NWI1YjE2NWRiNTUwOTUyYWM6N2RBMjFHdDN3ZlhJWE1ESDBLbXkwbzU0aExFYU1lUDF0NGpPM3FiNw==';

    try {
        response = await axios({
            method: 'post',
            url: 'https://login.eveonline.com/oauth/token',
            data: body,
            headers: {'Content-Type':'application/json', 'Authorization':AuthHeader}
        })
    } catch(err) {
        console.log(err)
    }  

    var tokens = response.data;


    
    try {
        response = await axios({
            method: 'get',
            url: 'https://login.eveonline.com/oauth/verify',
            headers: {'Authorization':'Bearer ' + tokens.access_token}
        })
    } catch(err) {
        console.log(err)
    }

    console.log(response.data)

    characters[response.data.CharacterName] = {
        "Name": response.data.CharacterName,
        "ID": response.data.CharacterID,
        "AccessToken": tokens.access_token
    }
    console.log(characters)
    // request.post({
    //     url: 'https://login.eveonline.com/oauth/token',
    //     body: bodyJSONString,
    //     headers: {'Content-Type':'application/json', 'Authorization':AuthHeader}
    // },  (err, response, responseBody) => {
    //     if (err) {
    //         return console.log("Recieved Error:\n" + err)
    //     } else {
    //         console.log("Received status code: %d", response.statusCode)
    //         console.log(JSON.parse(responseBody))
    //         accessToken = JSON.parse(responseBody).access_token
    //         console.log(accessToken)
    //         request.get({
    //             url: 'https://login.eveonline.com/oauth/verify',
    //             headers: {'Authorization':'Bearer ' + accessToken}
    //         }, (err, response, responseBody) => {
    //             if (err) {
    //                 return console.log("Problem with getting Char Name: \n" + err)
    //             } else {
    //                 var responseBody = JSON.parse(responseBody)
    //                 characterId = responseBody.CharacterID
    //                 characterName = responseBody.CharacterName
    //                 res.redirect('/')
    //             }
    //         })
    //     }
    // })
    res.redirect('http://localhost:3000')
});

server.listen(port, () => {
    console.log("Running on Port " + port)
})

// function convertItemIDtoNames(itemList) {
//     console.log(itemList)
//     for(var i = 0; i < itemList.length - 1; i++) {
//         var address = 'https://esi.evetech.net/latest/universe/types/' + itemList[i].type_id + '/?datasource=tranquility&language=en-us'

//         request.get({
//             url: address
//         }, (err, response, responseBody) => {
//             if (err) {
//                 return console.log("Error getting item info:\n" + err)
//             } else {
//                 itemList[i].type_id = JSON.parse(responseBody).name
//             }
//         })
//     }
// }