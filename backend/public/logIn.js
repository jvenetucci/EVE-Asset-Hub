// const simple = require('./../node_modules/eve-sso-simple')

// simple.login(
//     {
        
//     }
// )

function addCharacter() {
    console.log(this)
    var request = new XMLHttpRequest();
    request.open("GET", "http://localhost:3001/callback")
    request.send()
}