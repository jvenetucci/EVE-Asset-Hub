function getCharacters() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response)
            var x = JSON.parse(this.responseText)
            document.getElementById("currentChar").innerHTML = x.Name
            document.getElementById("characterID").innerHTML = x.ID
        }
    };
    request.open("GET", "http://localhost:3001/getCharacters")
    request.send()
}

function getItems() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var itemList = JSON.parse(this.response)
            createTable(itemList)
        }
    };
    request.open("GET", "http://localhost:3001/getItems")
    request.send()
}

function createTable(items) {
    var newTable = document.createElement("TABLE");
    var header = newTable.createTHead();
    var headerRow = header.insertRow(0);
    var itemCell = headerRow.insertCell(0);
    itemCell.innerHTML = "Item ID";
    var locationCell = headerRow.insertCell(1);
    locationCell.innerHTML = "Item Location ID"
    var quantityCell = headerRow.insertCell(2);
    quantityCell.innerHTML = "Quantity";
    var itemTypeCell = headerRow.insertCell(3);
    itemTypeCell.innerHTML = "Item Type ID";

    items.forEach(item => {
        var row = newTable.insertRow(-1);
        itemCell = row.insertCell(0);
        itemCell.innerHTML = item.item_id;
        locationCell = row.insertCell(1);
        locationCell.innerHTML = item.location_id;
        quantityCell = row.insertCell(2);
        quantityCell.innerHTML = item.quantity;
        itemTypeCell = row.insertCell(3);
        itemTypeCell.innerHTML = item.type_id;
    });
    document.getElementById("tableList").appendChild(newTable);
    console.log(newTable);
}