

let bgBlock = document.querySelector(".background-block")
let HISTORY = ""

function showLogout(bool) {
    if(bool){
        bgBlock.style.display = "block"
        document.querySelector(".logout-div").style.display = "grid"
        return
    }
    bgBlock.style.display = "none"
    document.querySelector(".logout-div").style.display = "none"
}

async function getHistory() {
   let result =  await fetch("/dealer/getHistory",{
        method:"POST"
        })
   let res = await result.json()
   HISTORY = res.history
   setHistory(1)
}

getHistory()

async function setHistory(par){

    let place = document.querySelector(".games .middle")
    let message = ""
    if(HISTORY.length < 1){
        message = `
        <div class="message">
            <div class="temp"></div>
            <div class="temp">nothing found</div>
            <div class="temp"></div>
            <div class="temp"></div>
        </div>
        `
    }
    HISTORY.forEach(element => {
        let date = new Date(element.time)
        if (!passDay(par,element.time)) return
        time = date.toLocaleDateString()
        message += `
        <div class="message">
            <div class="temp"> At ${time}</div>
            <div class="temp">Commission <strong>${element.betGain}</strong>  birr</div>
            <div class="temp">Total bet <strong>${element.totalBet}</strong>  birr</div>
            <div class="temp">Winner pay <strong>${element.winner}</strong>  birr</div>
        </div>
        `
    });
    place.innerHTML = message
}

function passDay(para,date) {
    let remainDay = Math.round((Date.now() - date) /  86400000)
    console.log(remainDay,para)
    switch (para) {
        case 1:
            {
                if(remainDay < 2)
                    return true
                return false
            }
        case 2:
            {
                if(remainDay < 3)
                    return true
                return false
            }
        case 3:
            {
                if(remainDay < 8)
                    return true
                return false
            }
        case 4:
            {
                if(remainDay < 31)
                    return true
                return false
            }
        
        case 5:
            {
                if(remainDay < (30 * 6 + 1))
                    return true
                return false
            }
        
        case 6:
            {
                if(remainDay < 367)
                    return true
                return false
            }
        case 7:
            return true
            
        default:
            break;
    }
    
}