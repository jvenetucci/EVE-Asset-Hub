# EVE-Asset-Hub
## Overview
EVEAssetHub is a tool that provides an overview of the assets owned across multiple characters. The tool is intended to be a web app.

The general use case for this tool is having an EVE online player with multiple accounts and/or multiple characters on each account. To see the assets that a character owns, they would need to be logged into that character. The tool is intended to give users an easy way to combine all owned assets into one list that they'll be able to filter and search through.

Existing solutions for this include jEveAsset which is a desktop application written in Java. For various reasons, users may not want to use a desktop app or install/use Java on their computer. Another alternative is EveThings which is a web based app built in Adobe Coldfusion. Shortly after the discovery of EVEThings I found out that it doesn't work. This leaves a gap that EVEAssetHub can fill. There are currently no web apps that provide an overview of all owned character assets.

## MVP
- Users can add what characters they want to see assets for (through SSO).
- The app will gather all assets owned across all characters and display them together.
- User can see a list of assets separated by who owns them.
- User can see a combined list of assets across all characters.
- User can search through the lists for specific items.
- User can filter the list based on:
    - Asset type
    - Owner
- The list will provide the following information about each asset:
    - Asset name
    - Quantity
    - Owner
    - Location

## Extra Features
- Display the assets in-game icon next to it
- Add in additional information about the assets, such as the information displayed ingame (volume, etc)
- Additional Filters
- Fun statistics on characters and accounts:
    - Which character has the largest net worth?
    - Whats the total net worth across all characters?
    - How much PLEX can you buy with the total net worth?
    - Etc...