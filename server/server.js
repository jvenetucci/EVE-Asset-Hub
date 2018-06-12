// Copyright (c) 2018 Potato Potaato
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE.md in the
// source distribution of this software for license terms.

const express = require('express');
const path = require('path');
const axios = require('axios');
const uniqid = require('uniqid');

const server = express();
const port = 3001;

require('./routes/index')(server);
require('./routes/route')(server);

var characters = []
var itemList = []

var typeIDDictionary = new Map();
var locationIDDictionary = new Map();

server.use(express.static(__dirname + '/public'));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

server.get('/callback', async (req, res) => {
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

    var charObject = {
        "Name": response.data.CharacterName,
        "ID": response.data.CharacterID,
        "AccessToken": tokens.access_token
    }

    if (characterExists(charObject.ID)) {
        console.log("Character " + charObject.Name + " already exists!")
    } else {
        characters.push(charObject)
        console.log("Added the following character: ");
        console.log(charObject)
    
        console.log("Characters now include: ");
        console.log(characters)
    }
    await grabItems()
    res.redirect('http://localhost:3000')
});

async function grabItems() {
    itemList = [];
    characters.forEach(async x => {
        var address = "https://esi.evetech.net/latest/characters/" + x.ID + "/assets/?datasource=tranquility&page=1&token=" + x.AccessToken

        res = await axios({
            method: 'get',
            url: address
        })

        items = res.data;
        items.forEach(async item => {

            var owner = x.Name;
            var UID = uniqid();

            var itemName = typeIDDictionary.get(item.type_id);
            if (itemName == undefined) {
                await lookupTypeID(item.type_id);
                itemName = typeIDDictionary.get(item.type_id)
            }
            var quantity = item.quantity;

            var locFlag = item.location_flag;
            var locType = item.location_type;
            var locName = locationIDDictionary.get(item.location_id);
            if (locName == undefined) {
                if (locType == 'station') {
                    await lookupStationID(item.location_id);
                    locName = locationIDDictionary.get(item.location_id);
                } else if (locType == 'solar_system') {
                    await lookupSolarID(item.location_id);
                    locName = locationIDDictionary.get(item.location_id);
                } else {
                    locName = "N/A"
                }
            }

            itemObject = {
                "UID": UID,
                "Owner": owner,
                "Name": itemName,
                "Quantity": quantity,
                "LocFlag": locFlag,
                "LocType": locType,
                "LocName": locName
            }
            itemList.push(itemObject);
        })
    })
    console.log("Successfully grabbed asset list for " + characters.length + " character(s)");
}

async function lookupTypeID(typeID) {
    var address = "https://esi.evetech.net/latest/universe/types/" + typeID + "/?datasource=tranquility&language=en-us"

    try {
        res = await axios({
            method: 'get',
            url: address
        })
        typeIDDictionary.set(typeID, res.data.name)
    } catch (err) {
        console.log("Caught Error: Encountered a problem fetching Type ID");
        lookupTypeID(typeID);
    }
}

async function lookupSolarID(locationID) {
    var address = "https://esi.evetech.net/latest/universe/systems/" + locationID + "/?datasource=tranquility&language=en-us/"

    try {
        res = await axios({
            method: 'get',
            url: address
        })
        locationIDDictionary.set(locationID, res.data.name);
    } catch (err) {
        console.log("Caught Error: Encountered a problem fetching SOLAR ID")
        lookupSolarID(locationID);
    }
}

async function lookupStationID(locationID) {
    var address = "https://esi.evetech.net/latest/universe/stations/" + locationID + "/?datasource=tranquility"

    try {
        res = await axios({
            method: 'get',
            url: address
        })
        locationIDDictionary.set(locationID, res.data.name)
    } catch (err) {
        console.log("Caught Error: Encountered a problem fetching STATION ID");
        lookupStationID(locationID);
    }
}

server.get('/getCharacters', (req, res) => {
    res.send(characters);
})

server.get('/getItems', (req, res) => {
    res.send(itemList);
})

server.listen(port, () => {
    console.log("Running on Port " + port);
})

function characterExists(characterID) {
    for (var i = 0; i < characters.length; i++) {
        if (characters[i].ID == characterID) {
            return true;
        }
    }
    return false;
}