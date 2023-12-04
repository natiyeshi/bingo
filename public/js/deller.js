let bgBlock = document.querySelector(".background-block")
let audio_block = document.querySelector(".audio-block")
let audioDiv = document.querySelector(".audio-load")
let progress = document.querySelector("#progress")

const CTX = new AudioContext();
let All_ADUIOS = { }
let audio_load =  1

document.querySelector(".background-block").style.display = "none"
document.querySelector(".bet-here").style.display = "none"
function calc(){

}
function load(){
        let arr = ["B/B","I/i","N/N","G/G","0/0"]
        let calculate = {0:[1,16],1:[16,31],2:[31,46],3:[46,61],4:[61,76]}
        for(let i = 0;i < 5;i++){
            let st = arr[i]
            let starter = calculate[i]
            for(let j = starter[0]; j < starter[1]; j++){
                let curr = st[0]+j
                let link = "../img/audio/"+st+j+".mp3"
                fetch(link)
                    .then(data => data.arrayBuffer())
                    .then(arrayBuffer => CTX.decodeAudioData(arrayBuffer))
                    .then(decodedAudio => {
                        All_ADUIOS[curr] = decodedAudio
                        audio_load ++
                        progress.value = audio_load
                        console.log(audio_load,curr);
                        if(audio_load > 74){
                            audio_block.style.display = "none"
                            audioDiv.style.display = "none"
                            if(localStorage.getItem("played") == 1){
                                document.querySelector(".background-block").style.display = "none"
                                document.querySelector(".bet-here").style.display = "none"
                            }else{
                                document.querySelector(".background-block").style.display = "block"
                                document.querySelector(".bet-here").style.display = "grid"
                            }
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                    })
        }
    }
}

function playSound(temp) {
    var source = CTX.createBufferSource()
    source.buffer = All_ADUIOS[temp];
    source.connect(CTX.destination);
    source.start(0);
}


(()=>{
    load()
    if(localStorage.getItem("played") == 1 && audio_load < 74){
        audio_block.style.display = "block"
        audioDiv.style.display = "flex"    
    }
})()


function checkAudioLoad() {
    if(audio_load > 74){
        return
    }
    audio_block.style.display = "block"
    audioDiv.style.display = "flex"    
}

checkAudioLoad()

let columns = document.querySelector(".result")

function fillColumn() {
    columns.innerHTML = ""
    for(i = 0; i < 15; i++){
        let B = 1
        let II = 16
        let N = 31
        let G = 46
        let O = 61
        columns.innerHTML += `
        <div class="row ">
                <div class="col b-box" id="b${B+i}">. . . .</div>
                <div class="col i-box" id="i${II+i}">. . . .</div>
                <div class="col n-box" id="n${N+i}">. . . .</div>
                <div class="col g-box" id="g${G+i}">. . . .</div>
                <div class="col o-box" id="o${O+i}">. . . .</div>
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
    let letter = {"b" : 0, "i" : 15, "n" : 30 , "g" : 45, "o" : 60}
    let files = []
    for(let l in letter){
        for(i = 1; i <= 15; i++){
            let temp = letter[l] + i
            files.push(l+"-"+temp)
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
let waitingGif = document.querySelector("#waiting-gif")
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
        if(item[0] == "o")
            playSound("0"+item.slice(2))
        else
            playSound((item[0].toUpperCase())+item.slice(2))
            
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
    betHere.style.display = "none"
    waitingGif.style.display = "block"
    let balance = await getBalance()
    let totalBet = amount * numOfPlayers
    let percentage = (totalBet) * (RATE / 100)
    percentage = Math.floor(percentage * 100) / 100
    let winner = totalBet - percentage
    if (percentage > balance){
        betHere.style.display = "grid"
        waitingGif.style.display = "none"
        betMessage.innerHTML = "your balance is insufficient !! <a href='/dealer/logout' class='pl-3'>logout</a>"
        betMessage.classList.add("text-danger")
        return
    } 

    setBalance(balance - percentage,totalBet,winner)
    document.querySelector(".information .bb-amount").innerHTML = totalBet
    document.querySelector(".information .bb-winner").innerHTML = totalBet - percentage
    document.querySelector(".information").style.display = "block"
    setTimeout(() => {
        document.querySelector(".information").style.display = "none"
    }, 4000);
    waitingGif.style.display = "none"
    bgBlock.style.display = "none"
    localStorage.setItem("played",1)
    checkAudioLoad()
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

