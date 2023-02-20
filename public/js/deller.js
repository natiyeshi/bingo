
let columns = document.querySelector(".result")
function fillColumn() {
    columns.innerHTML = ""
    for(i = 0; i < 80; i++){
        columns.innerHTML += `
        <div class="row ">
                <div class="col b-box">. . . .</div>
                <div class="col i-box">. . . .</div>
                <div class="col n-box">. . . .</div>
                <div class="col g-box">. . . .</div>
                <div class="col o-box">. . . .</div>
        </div>
        ` 
    }   
}

fillColumn()

let forms = document.querySelectorAll("form")
forms.forEach(element => {
    element.addEventListener("submit",e=>{
        e.preventDefault()
    })
});


function shuffle() {
    let letter = ["b", "i", "n", "g", "o"]
    let files = []
    for(l of letter){
        for(i = 1; i < 81; i++){
            files.push(l+"-"+i)
        }
    }
    let shuffledFile = []
    for (i = files.length; i--;) {
        var random = files.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
        shuffledFile.push(random)
    }
    return shuffledFile
}


let intervalId
let bgBlock = document.querySelector(".background-block")
let buttons = document.querySelector(".buttons")
let currentValue = document.querySelector("#currentValue")
let bcol = document.querySelectorAll(".b-box")
let icol = document.querySelectorAll(".i-box")
let ncol = document.querySelectorAll(".n-box")
let gcol = document.querySelectorAll(".g-box")
let ocol = document.querySelectorAll(".o-box")
let bc = ic = nc = gc = oc = 0

function start() {
    buttons.innerHTML = `<button class="start bg-success  text-white" onclick="beingo()">beingo</button>`
    let getShuffledFile = shuffle()
    currentValue.classList.add("circleIt")
    let counter = 0
    intervalId = setInterval(() => {
        let item = getShuffledFile[counter++]
        if(item[0] == "b"){
            bcol[bc].innerHTML = item
            bcol[bc++].classList.add("checked") 
        }
        else if(item[0] == "i"){
            icol[ic].innerHTML = item
            icol[ic++].classList.add("checked") 
        }
        else if(item[0] == "n"){
            ncol[nc].innerHTML = item
            ncol[nc++].classList.add("checked") 
        }
        else if(item[0] == "g"){
            gcol[gc].innerHTML = item
            gcol[gc++].classList.add("checked") 
        }
        else if(item[0] == "o"){
            ocol[oc].innerHTML = item
            ocol[oc++].classList.add("checked") 
        }
        currentValue.innerHTML = item
    }, 3000);
}

function beingo() {
    clearInterval(intervalId)
    currentValue.classList.remove("circleIt")
    buttons.innerHTML = `<button class="start bg-primary  text-white" onclick="restart()">Restart</button>`

}

function restart() {
    buttons.innerHTML = `<button class="start" onclick="start()">start</button>`
    document.querySelector(".bet-here").style.display = "grid"
    bgBlock.style.display = "grid" 
    fillColumn()
    bc = ic = nc = gc = oc = 0
    intervalId
    buttons = document.querySelector(".buttons")
    currentValue = document.querySelector("#currentValue")
    bcol = document.querySelectorAll(".b-box")
    icol = document.querySelectorAll(".i-box")
    ncol = document.querySelectorAll(".n-box")
    gcol = document.querySelectorAll(".g-box")
    ocol = document.querySelectorAll(".o-box")
}


function placeBet(button) {
    let balance = 10
    let betHere = document.querySelector(".bet-here")
    let betMessage = document.querySelector("#bet-message")
    let numOfPlayers = document.querySelector("#num_players").value.trim()
    let amount = document.querySelector("#amount").value.trim()
    let numOfPlayersLabel = document.querySelector(".num_players_label")
    let amountLabel = document.querySelector(".amount_label")
    let pass = true
    if(numOfPlayers == "" || numOfPlayers < 2){
        numOfPlayersLabel.innerHTML = "Number of players *"
        numOfPlayersLabel.classList.add("text-danger")
        pass = false
    } else{
        numOfPlayersLabel.innerHTML = "Number of players"
        numOfPlayersLabel.classList.remove("text-danger")
    }
    
    if(amount == "" || amount < 10){
        amountLabel.innerHTML = "Bet amount *"
        amountLabel.classList.add("text-danger")
        pass = false
    } else{
        amountLabel.innerHTML = "Bet amount"
        amountLabel.classList.remove("text-danger")
    }
    if(pass == false) return
    let percentage = (amount * numOfPlayers) * 0.2
    if (percentage > balance){
        betMessage.innerHTML = "your balance is insufficient !!"
        betMessage.classList.add("text-danger")
    } else{
        bgBlock.style.display = "none"
        betHere.style.display = "none"
    }
}


function showProfile(bool) {
    if(bool){
        bgBlock.style.display = "block"
        document.querySelector(".see-profile").style.display = "grid"
        return
    }
    bgBlock.style.display = "none"
    document.querySelector(".see-profile").style.display = "none"
}

function showLogout(bool) {
    if(bool){
        bgBlock.style.display = "block"
        document.querySelector(".logout-div").style.display = "grid"
        return
    }
    bgBlock.style.display = "none"
    document.querySelector(".logout-div").style.display = "none"
}