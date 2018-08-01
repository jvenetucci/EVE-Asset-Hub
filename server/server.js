// Copyright (c) 2018 Joseph Venetucci
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE.md in the
// source distribution of this software for license terms.

// This is the main file that runs the server.
// Included in this file is the server set up and
// all of its routes plus helper functions


const express = require('express');
const path = require('path');
const axios = require('axios');
const uniqid = require('uniqid');

const server = express();
const port = 3001;

// Holds the characters, items
var characters = []
var itemList = []

// Quick mappings from ID to Name
var typeIDDictionary = new Map();
var locationIDDictionary = new Map();

// *** SERVER SETUP ***
server.use(express.static(__dirname + '/public'));

server.listen(port, () => {
    console.log("Running on Port " + port);
})


// *** ROUTES ***
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

// GET endpoint that returns the character list
server.get('/getCharacters', (req, res) => {
    res.send(characters);
})

// GET endpoint that returns the item list
server.get('/getItems', (req, res) => {
    res.send(itemList);
})

// GET endpoint that is responsible for handling the EVE SSO
// This is the endpoint the EVE SSO redirects and sends an authorization code to.
// This endpoints main job is to grab an access token, character information, and asset list for that character
server.get('/callback', async (req, res) => {
    // Grab an access token from the auth code
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
        console.log("Error trying to obtain access token:");
        console.log(err);
    }

    // Now we have the tokens, grab the character data
    var tokens = response.data;

    try {
        response = await axios({
            method: 'get',
            url: 'https://login.eveonline.com/oauth/verify',
            headers: {'Authorization':'Bearer ' + tokens.access_token}
        })
    } catch(err) {
        console.log("Error trying to grab character data: ");
        console.log(err);
    }

    var charObject = {
        "Name": response.data.CharacterName,
        "ID": response.data.CharacterID,
        "AccessToken": tokens.access_token
    }


    // Check if this is a character the server already holds
    if (characterExists(charObject.ID)) {
        console.log("Character " + charObject.Name + " already exists!")
    } else {
        characters.push(charObject)
        console.log("Added the following character: ");
        console.log(charObject)
    
        console.log("Characters now include: ");
        console.log(characters)
    }

    // Grab a current list of all characters and redirect to the client.
    await grabItems()
    res.redirect('http://localhost:3000')
});

// *** HELPER FUNCTIONS ***

// This function is responsible for grabbing and translating the asset lists of all characters
// currently stored in the characters variable.
// Populates the itemList variable with a JSON list of assets
async function grabItems() {
    itemList = [];
    // For each character, grab their asset list
    characters.forEach(async x => {
        var address = "https://esi.evetech.net/latest/characters/" + x.ID + "/assets/?datasource=tranquility&page=1&token=" + x.AccessToken

        res = await axios({
            method: 'get',
            url: address
        })

        // For each item, translate the ID's to names. Build a new item object from this info.
        items = res.data;
        items.forEach(async item => {

            var owner = x.Name;
            var UID = uniqid();

            var itemName = typeIDDictionary.get(item.type_id);
            if (itemName == undefined) {    // If the ID isn't cached we need to retrieve it from ESI
                await lookupTypeID(item.type_id);
                itemName = typeIDDictionary.get(item.type_id)
            }
            var quantity = item.quantity;

            var locFlag = item.location_flag;
            var locType = item.location_type;
            var locName = locationIDDictionary.get(item.location_id);
            if (locName == undefined) {     // Same caching deal here
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

            // Build a new item object from this info.
            itemObject = {
                "UID": UID,
                "Owner": owner,
                "Name": itemName,
                "Quantity": quantity,
                "LocFlag": locFlag,
                "LocType": locType,
                "LocName": locName
            }

            // Add the new item to the item list
            itemList.push(itemObject);
        })
    })
    console.log("Successfully grabbed asset list for " + characters.length + " character(s)");
}

// Translates a type ID to a name and caches it
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

// Translates a solar ID to a name and caches it
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

// Translates a station ID to a name and caches it
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

// Checks to see if a character is already stored by the server based on its character ID
function characterExists(characterID) {
    for (var i = 0; i < characters.length; i++) {
        if (characters[i].ID == characterID) {
            return true;
        }
    }
    return false;
}