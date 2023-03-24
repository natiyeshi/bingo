// alert(localStorage.getItem("played"))
if(localStorage.getItem("played") == 1){
    document.querySelector(".background-block").style.display = "none"
    document.querySelector(".bet-here").style.display = "none"
}

let columns = document.querySelector(".result")

function fillColumn() {
    columns.innerHTML = ""
    for(i = 0; i < 80; i++){
        columns.innerHTML += `
        <div class="row ">
                <div class="col b-box" id="b${i}">. . . .</div>
                <div class="col i-box" id="i${i}">. . . .</div>
                <div class="col n-box" id="n${i}">. . . .</div>
                <div class="col g-box" id="g${i}">. . . .</div>
                <div class="col o-box" id="o${i}">. . . .</div>
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

async function getBalance(){
    let data = await fetch("/dealer/getBalance", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    return  await data.text()
}
  

async function setBalance(balance,totalBet,winner){
    await fetch('/dealer/setBalance', {
        method: 'POST', 
        body: JSON.stringify({balance,totalBet,winner}), 
        headers: {'Content-type': 'application/json; charset=UTF-8'}
    })

}


async function getAllData(){
    let data = await fetch("/dealer/getAllData",{
        method:"post",
        headers: { 'Content-Type': 'application/json' },
    })
    let value = await data.json()
    return  value
}


let RATE = 1
async function getRate(){

    let result = await fetch("/dealer/getRate",{
            method:"post",
        })
    let res = await result.json()
    RATE = parseInt(res)
    console.log(RATE)
    return RATE
}

getRate()

let intervalId
let betMessage = document.querySelector("#bet-message")
let bgBlock = document.querySelector(".background-block")
let buttons = document.querySelector(".buttons")
let currentValue = document.querySelector("#currentValue")
let bcol = document.querySelectorAll(".b-box")
let icol = document.querySelectorAll(".i-box")
let ncol = document.querySelectorAll(".n-box")
let gcol = document.querySelectorAll(".g-box")
let ocol = document.querySelectorAll(".o-box")
let bc = ic = nc = gc = oc = 0


 async function setBetMessage(){
    let balance = await getBalance()
    betMessage.innerHTML = `
             your balance is ${balance}  birr
            <br> <a href='/dealer/logout' class="pl-3">logout</a> 
      `
}

setBetMessage()
let jump = true

function pause(temp){
    jump = !jump
    if(!jump) {
        currentValue.classList.remove("circleIt")
        temp.innerHTML = "resume"
        return
    }
    currentValue.classList.add("circleIt")
    temp.innerHTML = "pause"

}

let audios = {}
for(let i = 1; i < 81;i++) {
    audios["b"+i] = new Audio("../img/audio/B/B"+i+".mp3")
}
console.log(audios)
function start() {
    localStorage.setItem("played",0)
    setBetMessage()
    buttons.innerHTML = `
    <button class="bg-success  text-white" onclick="bingo()">bingo</button>
    <button class="bg-transparent text-white" onclick="pause(this)" >pause</button>
    `
    let getShuffledFile = shuffle()
    
    currentValue.classList.add("circleIt")
    let counter = 0
    intervalId = setInterval(() => {
        if(jump == false){
            return
        }
        let item = getShuffledFile[counter++]
        audios["b"+item.slice(2)].play()
        if(item[0] == "b"){
            bcol[bc].innerHTML = item
            location.href = "#"+bcol[bc].id
            bcol[bc++].classList.add("checked") 
        }
        else if(item[0] == "i"){
            icol[ic].innerHTML = item
            location.href = "#"+ icol[ic].id
            icol[ic++].classList.add("checked") 
        }
        else if(item[0] == "n"){
            ncol[nc].innerHTML = item
            location.href = "#"+ ncol[nc].id
            ncol[nc++].classList.add("checked") 
        }
        else if(item[0] == "g"){
            gcol[gc].innerHTML = item
            location.href = "#"+ gcol[gc].id
            gcol[gc++].classList.add("checked") 
        }
        else if(item[0] == "o"){
            ocol[oc].innerHTML = item
            location.href = "#"+ ocol[oc].id
            ocol[oc++].classList.add("checked") 
        }
        currentValue.innerHTML = item
        setPreviouseValue(item)
    }, 7000);
}
let preValues = []
function setPreviouseValue(value){
    preValues.splice(0,0,value)
    if(preValues.length > 3){
        preValues.pop()
    }
    a = 1
    for(i of preValues){
        document.querySelector(".last"+a).innerHTML = i
        a++
    }
}


async function bingo() {
    localStorage.setItem("played",0)
    preValues = []
    jump = true
    document.querySelector("#currentValue").innerHTML = "..."
    for(i = 1; i < 4; i++){
        document.querySelector(".last"+i).innerHTML = "..."
    }
    clearInterval(intervalId)
    currentValue.classList.remove("circleIt")
    buttons.innerHTML = `<button class="start bg-primary  text-white" onclick="restart()">Restart</button>`
    await getRate()
    for(let i = 1; i < 81;i++) {
        audios["b"+i].pause()
    }
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


async function placeBet(button) {
    let balance = await getBalance()
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
    let totalBet = amount * numOfPlayers
    let percentage = (totalBet) * (RATE / 100)
    percentage = Math.floor(percentage * 100) / 100
    let winner = totalBet - percentage
    if (percentage > balance){
        betMessage.innerHTML = "your balance is insufficient !! <a href='/dealer/logout' class='pl-3'>logout</a>"
        betMessage.classList.add("text-danger")
        return
    } 
    setBalance(balance - percentage,totalBet,winner)    
    bgBlock.style.display = "none"
    betHere.style.display = "none"
    localStorage.setItem("played",1)
}


async function showProfile(bool) {
    if(bool){
        bgBlock.style.display = "block"
        document.querySelector(".see-profile").style.display = "grid"
        let data = await getAllData()
        document.querySelector("#profileFile").innerHTML = `      
            <span>Username <strong>${data.username}</strong></span>
            <span>Balance <strong> ${data.balance} birr</strong></span>
        `
        
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
function logout() {
    localStorage.setItem("played",0)
    location.href='/dealer/logout'
}

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}
let bool = false
function fullScreen(self){
    if(!bool){
        self.innerHTML = "back to old"
        openFullscreen()
    } else{ 
        self.innerHTML = "Full Screen"
        closeFullscreen()
    }
    bool = !bool
}
