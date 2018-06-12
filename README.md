# EVE-Asset-Hub
## Overview
EVEAssetHub is a tool that provides an overview of the assets owned across multiple EVE Online characters. The tool is intended to be a web app.

The general use case for this tool is an EVE online player with multiple accounts and/or multiple characters on each account. To see the assets that a character owns, they would need to be logged into that character. The tool's purpose is to give users an easy way to combine all owned assets into one list that they'll be able to filter and search through.

Existing solutions for this include jEveAsset which is a desktop application written in Java. For various reasons, users may not want to use a desktop app or install/use Java on their computer. Another alternative is EveThings which is a web based app built in Adobe Coldfusion. Trying to use EVEThings I found out that it doesn't work. This leaves a gap that EVEAssetHub can fill. There are currently no web apps (to my knowledge) that provide an overview of all owned character assets.

EVE Asset Hub was created fully in Javascript, using the React framework for the frontend.

---

## Table of Contents

- [Features](#Features)
- [How to install and run](#How-to-Install-and-Run)
- [How to use](#How-to-Use)
- [FAQ](#FAQ)
- [Areas for Future Development](#Areas-for-Future-Development)
- [Licensing](#Licensing)

---

## Features
- Users can add what characters they want to see assets for through EVE's SSO.
- The app will gather all assets owned across all characters and display them together in one combined list.
- The list will provide the following information about each asset:
    - Asset name
    - Quantity
    - Location
        - Name
        - Type (Station/Solar/Etc)
        - Flag (Hanger/Slot in Ship/Etc)
    - Owner
- A search feature allows the list to be filtered based on:
    - Item Name
    - Location
    - Owner
- The list can be exported as a CSV file for use in another application. Either the current search results or the entire list can be exported.

---

## How to Install and Run
This section will help you setup EVE asset Hub to run locally on a machine ultilizing local ports 3000 and 3001.

EVE Asset Hub was made with Javascript and contains client and server side portions located respectively in `/client` and `/server`. Because of this [Node.js](https://nodejs.org/en/) and it's package manager npm is required to run this web app locally.

Running the app requires the setup of both the client and server. Each is a two step process. First required pakages must be installed and then the server/client needs to run. This process requires that you have two shells open; one for running the server and another for the client. Starting with the server, do the following to build and run it:

```terminal
$ cd /server
$ npm install
$ npm start
```

In your other shell do the following to run the client:
```terminal
$ cd /client
$ npm install
$ npm start
```

At this point each shell window should be running either the server or client. You can verify this by visiting `localhost:3000` for the client and `localhost:3001` for the server. The server provides a nice little webpage at it's base endpoint, along with two other endpoints that are useful to grab character and asset data outside of the client.

---

## How to Use
In order to use the client navigate to `localhost:3000` in your browser. The client is pretty straightforward to use. It can be broken up into two sections. The first section is immedietly under the header and could be labeled as the *Toolbar* section. Here you can add characters, search, refresh, and export. Below this is the *Asset List* section which will display a list of assets once characters are added.

To get started first you'll need to add a character. Click the **Add Character** button located at the left of the *Toolbar*. This will take you through EVE Online's SSO system which will require you to log in and select a character. Once thats finished you'll be redirected back to the client. At first you may notice that no items have shown up. This may be due to the server still working to grab all the assets from the character. Give it a few seconds and then press the **Refresh** button in the *Toolbar*. You should now see a list of all assets that your character owns.

This is the general process of using the client. The above can be summarized as:
1. Add a character.
2. Refresh the item list using the **Refresh** button.

From here you can do whatever you need to do. The following is an explanation of each item in the *Toolbar*:
- **Add Character Button**
    - Uses EVE Online's SSO to add a new character to the App
    - To view characters that the app currently has go to `localhost:3001/getCharacters`
- **Search Bar** & **Search Button**
    - This allows you to search through and filter the list.
    - You can search for terms in the following categories:
        - Item Name
        - Location Name
        - Owner Name
    - Use the button to execute your search.
- **Reset Button**
    - Use this to reset the view and see all items.
    - This primarily used after you've searched and would like to get back to a total view of everything.
- **Refresh Button**
    - This button makes the server requery the EVE REST API for an updated list of items for all characters. Once it's finished the data gets sent back to the client.
    - Generally there are two times when you use this:
        1. When you add a new character and their items haven't been added to the list yet.
        2. When assets change in-game and you need an updated list.
- **Export Button**
    - The export button allows you to export the asset list as a CSV file.
    - You can either:
        1. Export the current view.
        2. Export the entire asset list.

---

## FAQ
- I'm getting a proxy related error when trying to run the client.
    - Make sure to run the server **first** and then the client.

- How come location names are showing up as N/A? What does "other" mean in the Location Type collumn?
    - Location name is tied to the location type. This means that when the location type is *station* then its fairly easy to find out the name of the station. When the type is *other* then it becomes more difficult to decode the location name since it could refer to a variety of things that are decoded using separate endpoints in the EVE ESI. In most cases *other* means the item is either in the cargo hold of a ship, or fitted to a ship.
    - [More info on this can be found on the EVE Forums](https://forums.eveonline.com/t/asset-location-id-quick-reference/51537)

- Why does the App need the scope to read my characters wallet?
    - At one point a cool feature of the app was to display relevant character information as well such as their current wallet balance. I've let the scope as in the App in case anyone wants to add this feature.

- What libraries did you use to build this?
    - Everything is done in Javascript. As far as libraries go:
        - React
        - Express.js
        - Axios
        - Fuse.js
        - uniqid
        - json2cvs

- Why do I need to use the refresh button after adding a character?
    - This is because of the asynchronus nature of Javascript. After adding a character the server works to grab all the assets and translate IDs to actual names. This can take some time because the server needs to make HTTP requests to the EVE ESI in order to do the translation. To avoid making you wait and stare at a blank browser, you are immedietly returned to the client. After waiting a few seconds you can push refresh to get an updated list from the server.
    - This is a problem for the first few characters you add. As you add more characters/assets the translations from ID to Name are cached, making future translations faster. Perhaps by the 3rd or 4th character you add the list will be ready once you return to the client.
    - It's still good practice to use refresh after every character addition.

- How can I fix it so where I don't need to hit refresh after every character addition?
    - Good question! This could be accomplished through sockets. After the server finished doing what it needs to do, let the client know and send over a new asset list. Since the client is in react you want to make sure not to re-render the page when this data is sent over if the user is currently doing a search.

---

## Areas for Future Development
Here are some ideas of extra features and further development:
- Create a system for ultilizing refresh tokens.
    - Currently access tokens are gained, but once they've expired there is nothing in place that uses the refresh token.
- Translate all the N/A location names & other location types to something useful.
- Add the ability to remove characters.
- Show how much ISK a character has.
- Impliment sockets to avoid having to use the refresh button.
- Add a new column that indicates the item type (Ammo, Ore, Ship, etc)
- Change the stylesheet of the app from its current black/grey scheme to something more exciting.

---

## Licensing
This project is licensed under the MIT License. For a copy of the license see `LICENSE.md` in the root directory.