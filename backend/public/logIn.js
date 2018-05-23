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
            console.log(this.response)
            var x = JSON.parse(this.responseText)
        }
    };
    request.open("GET", "http://localhost:3001/getItems")
    request.send()
}